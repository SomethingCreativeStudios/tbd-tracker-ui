export default function getEnv(name) {
   // @ts-ignore
   const varName = window?.configs?.[name];
   return !varName.startsWith('$') ? varName : process.env[name];
}
