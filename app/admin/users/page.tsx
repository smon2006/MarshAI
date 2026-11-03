"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Users, Search, Trash2 } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    subscription: {
        planType: string;
        isActive: boolean;
    } | null;
    _count: {
        reports: number;
        usage: number;
    };
}

export default function AdminUsersPage(){

    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingRole, setUpdatingRole] = useState<string | null>(null);
    const [updatingPlan, setUpdatingPlan] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    },[]);


    const fetchUsers = async () => {
        try {
            const response = await axios.get("/api/admin/users");
            setUsers(response.data.users);
            console.log("User data",response.data.users);
        } catch (error) {
            console.error("Error fetching users", error);
        }finally{
           setIsLoading(false); 
        }
    }


    const handleUpdateRole = async (userId: string, newRole: string) => {
        setUpdatingRole(userId);

        try {
            await axios.patch(`/api/admin/users/${userId}`, {role: newRole});
            await fetchUsers();
            alert("User role updated successfully");
        } catch (error) {
            console.error("Error updating role", error);
        } finally {
            setUpdatingRole(null);
        }
    };



    const handleUpdatePlan = async (userId: string, newPlan: string) => {
        setUpdatingPlan(userId);

        try {
            await axios.patch(`/api/admin/users/${userId}`, {planType: newPlan});
            await fetchUsers();
            alert("Subsciption plan updated successfully");
        } catch (error) {
            console.error("Error updating plan", error);
        } finally {
            setUpdatingPlan(null);
        }
    };



    const handleDeleteUser = async (userId: string, email: string) => {

        if (!confirm("Are you user to delete this user")) {
            return;
        }

        try {
            await axios.delete(`/api/admin/users/${userId}`);
            await fetchUsers();
            alert("User deleted successfully");
        } catch (error) {
            console.error("Error for delete user", error);
        }
    }






    const filteredUsers = users.filter((user) => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    );



return (
   <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">User Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage all platform users</p>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
            <div className="text-3xl font-bold">{users.length}</div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            <Users className="w-5 h-5" />
            All Users
          </h2>
        </div>
        <div className="px-6 py-4">
        {isLoading ? ( 
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-100 dark:bg-gray-800 rounded"></div>
                </div>
              ))}
            </div>
        ) : ( filteredUsers.length === 0 ? ( 
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No users found</p>
            </div>
          ) : (  
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Reports
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
    {filteredUsers.map((user) => (               
    <tr key={user.id}  className="hover:bg-gray-50 dark:hover:bg-gray-800">
        <td className="px-4 py-4">
        <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">{user.name || "No Name"}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
        </div>
        </td>
        <td className="px-4 py-4">
        <select
            value={user.role}
            onChange={(e) => handleUpdateRole(user.id, e.target.value)}
            disabled={updatingRole === user.id }
            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
        >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
        </select>
        </td>
        <td className="px-4 py-4">
        {user.subscription ? (
            <select
            value={user.subscription.planType}
            onChange={(e) => handleUpdatePlan(user.id, e.target.value)}
            disabled={updatingPlan === user.id }            
            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
            >
            <option value="FREE">FREE</option>
            <option value="PRO">PRO</option>
            </select>
         ) : ( 
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            No subscription
            </span>
        )}
        </td>
        <td className="px-4 py-4">
        <span className="text-sm text-gray-900 dark:text-gray-100">{user._count.reports}</span>
        </td>
        <td className="px-4 py-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            })}
        </span>
        </td>
        <td className="px-4 py-4">
        <button
            onClick={() => handleDeleteUser(user.id, user.email)}
            className="inline-flex items-center justify-center p-1.5 text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
        >
            <Trash2 className="w-4 h-4" />
        </button>
        </td>
    </tr>
     )) }            
                </tbody>
              </table>
            </div>
          ))} 
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
          {users.filter((u) => u.role === "ADMIN").length}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Pro Users</p>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {users.filter((u) => u.subscription?.planType === "PRO").length}
        </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Free Users</p>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
           {users.filter((u) => u.subscription?.planType === "FREE").length}
          </div>
        </div>
      </div>
    </div>  
)



}