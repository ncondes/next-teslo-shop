import { PeopleOutline } from '@mui/icons-material';
import { Grid, MenuItem, Select } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { tesloApi } from '../../api';
import { AdminLayout } from '../../components/layouts';
import { IUser } from '../../interfaces';

const UsersPage = () => {
   const { data, error } = useSWR<IUser[]>('/api/admin/users');
   const [users, setUsers] = useState<IUser[]>([]);

   useEffect(() => {
      if (data) {
         setUsers(data);
      }
   }, [data]);

   if (!data && !error) return <></>;

   const onRoleUpdated = async (userId: string, newRole: string) => {
      const previousUsers = users.map((user) => ({ ...user }));
      const updatedUsers = users.map((user) => ({
         ...user,
         role: userId === user._id ? newRole : user.role,
      }));

      setUsers(updatedUsers);

      try {
         const body = { userId, role: newRole };

         await tesloApi.put('/admin/users/', body);
      } catch (error) {
         setUsers(previousUsers);
         console.log(error);
         alert('Unable to update the user role.');
      }
   };

   const columns: GridColDef[] = [
      { field: 'name', headerName: 'Name', width: 300 },
      { field: 'email', headerName: 'Email', width: 400 },
      {
         field: 'role',
         headerName: 'Role',
         width: 300,
         renderCell: ({ row }: GridValueGetterParams) => {
            return (
               <Select
                  value={row.role}
                  label="Role"
                  sx={{ width: 300 }}
                  onChange={({ target }) => onRoleUpdated(row.id, target.value)}
               >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="client">Client</MenuItem>
                  <MenuItem value="super-user">Super User</MenuItem>
                  <MenuItem value="SEO">SEO</MenuItem>
               </Select>
            );
         },
      },
   ];

   const rows = users.map((user) => ({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
   }));

   return (
      <AdminLayout title={'Users'} subtitle={'User Maintenance'} icon={<PeopleOutline />}>
         <Grid container className="fadeIn">
            <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
               <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
            </Grid>
         </Grid>
      </AdminLayout>
   );
};

export default UsersPage;
