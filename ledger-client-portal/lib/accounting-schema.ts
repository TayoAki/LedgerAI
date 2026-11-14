// Fail closed on an unrecognised input schema. Provider metadata never becomes executable code.
export function validateToolArguments(input:any,argumentsValue:any){
 const invalid=(message:string):never=>{throw Object.assign(Error(message),{status:400});};
 if(!input||typeof input!=='object'||Array.isArray(input))invalid('The tool input schema is unavailable.');
 const isSchema=['type','properties','$ref','allOf','anyOf','oneOf'].some(key=>key in input);
 const root=isSchema?input:{type:'object',properties:input,required:Object.keys(input).filter(key=>input[key]?.required===true),additionalProperties:false};
 const annotations=['title','description','default','examples','example','deprecated','readOnly','writeOnly','$id','$schema','$comment'];
 const supported=new Set([...annotations,'type','properties','required','additionalProperties','items','enum','const','minLength','maxLength','pattern','minimum','maximum','exclusiveMinimum','exclusiveMaximum','multipleOf','minItems','maxItems','uniqueItems','allOf','anyOf','oneOf','not','format','$ref','$defs','definitions','nullable','minProperties','maxProperties']);
 const resolve=(schema:any,depth:number):any=>{if(depth>16)invalid('Tool schema is too deeply nested.');if(schema?.$ref){if(Object.keys(schema).some(key=>key!=='$ref'&&!annotations.includes(key)))invalid('Schema reference siblings need explicit support before execution.');if(typeof schema.$ref!=='string'||!schema.$ref.startsWith('#/'))invalid('External schema references are unsupported.');let target=root;for(const segment of schema.$ref.slice(2).split('/')){const key=segment.replace(/~1/g,'/').replace(/~0/g,'~');if(['__proto__','prototype','constructor'].includes(key)||!target||!Object.hasOwn(target,key))invalid('Unresolved tool schema reference.');target=target[key];}return resolve(target,depth+1);}return schema;};
 const inspect=(schema:any,depth:number)=>{schema=resolve(schema,depth);if(typeof schema==='boolean')return;if(!schema||typeof schema!=='object'||Array.isArray(schema)||Object.keys(schema).some(key=>!supported.has(key)))invalid('This tool schema needs explicit support before execution.');if(schema.format&&!['date','date-time','uuid','uri','url','email'].includes(schema.format))invalid('Unsupported tool argument format.');for(const child of Object.values(schema.properties||{}))inspect(child,depth+1);for(const key of ['allOf','anyOf','oneOf'])if(schema[key]){if(!Array.isArray(schema[key]))invalid('Invalid composite schema.');for(const branch of schema[key])inspect(branch,depth+1);}for(const key of ['items','not','additionalProperties'])if(typeof schema[key]==='object')inspect(schema[key],depth+1);};
 const visit=(value:any,schema:any,path:string,depth:number)=>{
  schema=resolve(schema,depth);if(schema===true)return;if(schema===false)invalid(path+' is not allowed.');if(!schema||typeof schema!=='object')invalid('Unsupported tool input schema.');
  if(Object.keys(schema).some(key=>!supported.has(key)))invalid('This tool schema contains unsupported validation rules.');
  if(value===null&&schema.nullable)return;
  if(schema.allOf){if(!Array.isArray(schema.allOf))invalid('Invalid tool schema.');for(const branch of schema.allOf)visit(value,branch,path,depth+1);}
  for(const key of ['anyOf','oneOf'])if(schema[key]){if(!Array.isArray(schema[key]))invalid('Invalid tool schema.');let matched=0;for(const branch of schema[key]){try{visit(value,branch,path,depth+1);matched++;}catch{}}if(!matched||(key==='oneOf'&&matched!==1))invalid(path+' does not match the tool schema.');}
  if(schema.not){let matches=true;try{visit(value,schema.not,path,depth+1);}catch{matches=false;}if(matches)invalid(path+' is not allowed by the tool schema.');}
  const types=Array.isArray(schema.type)?schema.type:schema.type?[schema.type]:schema.properties?['object']:[];
  if(types.length&&!types.some((type:string)=>type==='null'?value===null:type==='array'?Array.isArray(value):type==='object'?value!==null&&typeof value==='object'&&!Array.isArray(value):type==='integer'?Number.isInteger(value):type==='number'?typeof value==='number'&&Number.isFinite(value):['string','boolean'].includes(type)?typeof value===type:false))invalid(path+' has the wrong type.');
  if(schema.enum&&!schema.enum.some((v:any)=>JSON.stringify(v)===JSON.stringify(value)))invalid(path+' is not an allowed value.');
  if(Object.hasOwn(schema,'const')&&JSON.stringify(value)!==JSON.stringify(schema.const))invalid(path+' must match the required value.');
  if(value&&typeof value==='object'&&!Array.isArray(value)){
   const properties=schema.properties||{},required=Array.isArray(schema.required)?schema.required:[];
   for(const key of required)if(!Object.hasOwn(value,key))invalid(path+'.'+key+' is required.');
   if(schema.minProperties!==undefined&&Object.keys(value).length<schema.minProperties)invalid(path+' has too few fields.');
   if(schema.maxProperties!==undefined&&Object.keys(value).length>schema.maxProperties)invalid(path+' has too many fields.');
   for(const [key,item] of Object.entries(value)){if(['__proto__','prototype','constructor'].includes(key))invalid('Unsupported argument name.');if(Object.hasOwn(properties,key))visit(item,properties[key],path+'.'+key,depth+1);else if(schema.additionalProperties&&typeof schema.additionalProperties==='object'&&depth>0)visit(item,schema.additionalProperties,path+'.'+key,depth+1);else if(depth===0||schema.additionalProperties===false||!schema.additionalProperties)invalid(path+'.'+key+' is not a declared tool argument.');}
  }
  if(Array.isArray(value)){if(schema.minItems!==undefined&&value.length<schema.minItems)invalid(path+' has too few entries.');if(schema.maxItems!==undefined&&value.length>schema.maxItems)invalid(path+' has too many entries.');if(schema.uniqueItems&&new Set(value.map(v=>JSON.stringify(v))).size!==value.length)invalid(path+' must contain unique entries.');if(!schema.items&&value.length)invalid('Array item schema is unavailable.');for(let i=0;i<value.length;i++)visit(value[i],schema.items,path+'['+i+']',depth+1);}
  if(typeof value==='string'){
   if(schema.minLength!==undefined&&value.length<schema.minLength)invalid(path+' is too short.');if(schema.maxLength!==undefined&&value.length>schema.maxLength)invalid(path+' is too long.');
   if(schema.pattern){if(typeof schema.pattern!=='string'||schema.pattern.length>256)invalid('Unsupported tool argument pattern.');if(!new RegExp(schema.pattern).test(value))invalid(path+' has an invalid format.');}
   if(schema.format&&!['date','date-time','uuid','uri','url','email'].includes(schema.format))invalid('Unsupported tool argument format.');
   if(schema.format==='date'&&(!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(Date.parse(value))||new Date(value).toISOString().slice(0,10)!==value))invalid(path+' must be a date.');
   if(schema.format==='date-time'&&(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/i.test(value)||!Number.isFinite(Date.parse(value))))invalid(path+' must be a timestamp.');
   if(schema.format==='uuid'&&!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value))invalid(path+' must be a UUID.');
   if(schema.format==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))invalid(path+' must be an email address.');
   if(['uri','url'].includes(schema.format)){try{new URL(value);}catch{invalid(path+' must be an absolute URI.');}}
  }
  if(typeof value==='number'){if(schema.minimum!==undefined&&value<schema.minimum||schema.maximum!==undefined&&value>schema.maximum||schema.exclusiveMinimum!==undefined&&value<=schema.exclusiveMinimum||schema.exclusiveMaximum!==undefined&&value>=schema.exclusiveMaximum)invalid(path+' is outside the allowed range.');if(schema.multipleOf!==undefined&&(!(schema.multipleOf>0)||Math.abs(value/schema.multipleOf-Math.round(value/schema.multipleOf))>1e-10))invalid(path+' is not an allowed multiple.');}
 };
 if(!argumentsValue||typeof argumentsValue!=='object'||Array.isArray(argumentsValue))invalid('Structured arguments must be an object.');
 inspect(root,0);
 visit(argumentsValue,root,'arguments',0);
}
