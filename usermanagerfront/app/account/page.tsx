import { usersApi } from "@/lib/api/users";

async function fetchCurrentUser() {
  const user = await usersApi.getCurrentUser();
  return user;
}

export default async function Page() {
  const currentUser = await fetchCurrentUser();
  console.log(currentUser);
  
  return (
    <div>
      <h1>Bienvenido, {currentUser?.username}</h1>
      <ul>
        <li>Email: {currentUser?.email}</li>
        <li>Nombre: {currentUser?.firstName} {currentUser?.lastName}</li>
        <li>Activo: {currentUser?.isActive ? 'Sí' : 'No'}</li>
        <li>Rol: {currentUser?.role}</li>
        <li>Creado: {currentUser?.createdAt}</li>
        <li>Actualizado: {currentUser?.updatedAt}</li>
      </ul>
    </div>
  );
}