import { User } from "@/types/user";


export default async function UserInfo({ user }: { user: User }) {
  console.log(user);
  
  return (
    <div>
      <h1>User Info Page: {user.username}</h1>
      <ul>
        <li>Email: {user.email}</li>
        <li>Nombre: {user.firstName} {user.lastName}</li>
        <li>Activo: {user.isActive ? 'Sí' : 'No'}</li>
        <li>Rol: {user.role}</li>
        <li>Creado: {user.createdAt}</li>
        <li>Actualizado: {user.updatedAt}</li>
      </ul>
    </div>
  );
}
