export default function getEnv(name) {
   const varName = window?.configs?.[name];
   return !varName.startsWith('$') ? varName : process.env[name];
}
