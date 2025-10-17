import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Settings as SettingsIcon, 
  Users, 
  Receipt, 
  Edit,
  Save,
  Upload
} from 'lucide-react';
import { mockUsers, mockTaxSettings, User as UserType } from '@/lib/mockData';
import { toast } from 'sonner';

const Settings = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserType[]>(mockUsers);
  const [taxEnabled, setTaxEnabled] = useState(mockTaxSettings.enabled);
  const [taxRate, setTaxRate] = useState(mockTaxSettings.rate.toString());
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    role: 'rider' as 'admin' | 'rider',
    password: ''
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toast.error('Password baru dan konfirmasi password tidak sama');
      return;
    }

    // Update user profile (in real app, this would call API)
    toast.success('Profil berhasil diperbarui');
    setIsEditingProfile(false);
  };

  const handleTaxUpdate = () => {
    mockTaxSettings.enabled = taxEnabled;
    mockTaxSettings.rate = parseFloat(taxRate);
    toast.success('Pengaturan pajak berhasil diperbarui');
  };

  const handleUserEdit = (userToEdit: UserType) => {
    setEditingUser(userToEdit);
    setUserFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role,
      password: ''
    });
    setIsUserDialogOpen(true);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(u => 
        u.id === editingUser.id 
          ? { ...u, name: userFormData.name, email: userFormData.email, role: userFormData.role }
          : u
      ));
      toast.success('Pengguna berhasil diperbarui');
    } else {
      // Add new user
      const newUser: UserType = {
        id: Date.now().toString(),
        name: userFormData.name,
        email: userFormData.email,
        role: userFormData.role
      };
      setUsers(prev => [...prev, newUser]);
      toast.success('Pengguna berhasil ditambahkan');
    }

    setIsUserDialogOpen(false);
    setEditingUser(null);
    setUserFormData({ name: '', email: '', role: 'rider', password: '' });
  };

  const handleUserDelete = (userId: string) => {
    if (userId === user?.id) {
      toast.error('Tidak dapat menghapus akun sendiri');
      return;
    }
    
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast.success('Pengguna berhasil dihapus');
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola profil dan pengaturan sistem
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          {user?.role === 'admin' && (
            <>
              <TabsTrigger value="users">Manajemen Pengguna</TabsTrigger>
              <TabsTrigger value="tax">Pengaturan Pajak</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil Pengguna
              </CardTitle>
              <CardDescription>
                Kelola informasi profil dan keamanan akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.profilePicture} alt={user?.name} />
                  <AvatarFallback className="text-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <Badge variant="secondary" className="capitalize">
                    {user?.role}
                  </Badge>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Ganti Foto
                    </Button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditingProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditingProfile}
                    />
                  </div>
                </div>

                {isEditingProfile && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Password Saat Ini</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={profileData.currentPassword}
                        onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Password Baru</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={profileData.newPassword}
                        onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {isEditingProfile ? (
                    <>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Perubahan
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditingProfile(false)}
                      >
                        Batal
                      </Button>
                    </>
                  ) : (
                    <Button 
                      type="button" 
                      onClick={() => setIsEditingProfile(true)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profil
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {user?.role === 'admin' && (
          <>
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Manajemen Pengguna
                    </CardTitle>
                    <CardDescription>
                      Kelola pengguna sistem dan hak akses mereka
                    </CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingUser(null);
                    setUserFormData({ name: '', email: '', role: 'rider', password: '' });
                    setIsUserDialogOpen(true);
                  }}>
                    Tambah Pengguna
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((userItem) => (
                        <TableRow key={userItem.id}>
                          <TableCell className="font-medium">{userItem.name}</TableCell>
                          <TableCell>{userItem.email}</TableCell>
                          <TableCell>
                            <Badge variant={userItem.role === 'admin' ? "default" : "secondary"} className="capitalize">
                              {userItem.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUserEdit(userItem)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleUserDelete(userItem.id)}
                                disabled={userItem.id === user?.id}
                              >
                                Hapus
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tax" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Pengaturan Pajak
                  </CardTitle>
                  <CardDescription>
                    Kelola pengaturan pajak untuk transaksi penjualan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="tax-enabled"
                      checked={taxEnabled}
                      onCheckedChange={setTaxEnabled}
                    />
                    <Label htmlFor="tax-enabled">Aktifkan Pajak</Label>
                  </div>

                  {taxEnabled && (
                    <div className="space-y-2">
                      <Label htmlFor="tax-rate">Tarif Pajak (%)</Label>
                      <Input
                        id="tax-rate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={taxRate}
                        onChange={(e) => setTaxRate(e.target.value)}
                        className="w-32"
                      />
                      <p className="text-sm text-muted-foreground">
                        Masukkan tarif pajak dalam persen (contoh: 10 untuk 10%)
                      </p>
                    </div>
                  )}

                  <Button onClick={handleTaxUpdate}>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Pengaturan Pajak
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* User Management Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingUser ? 'Perbarui informasi pengguna' : 'Tambahkan pengguna baru ke sistem'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUserSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="userName" className="text-right">
                  Nama *
                </Label>
                <Input
                  id="userName"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="userEmail" className="text-right">
                  Email *
                </Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="userRole" className="text-right">
                  Role *
                </Label>
                <Select
                  value={userFormData.role}
                  onValueChange={(value: 'admin' | 'rider') => setUserFormData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rider">Rider/Kasir</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {!editingUser && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="userPassword" className="text-right">
                    Password *
                  </Label>
                  <Input
                    id="userPassword"
                    type="password"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="col-span-3"
                    required={!editingUser}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit">
                {editingUser ? 'Perbarui' : 'Tambah'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;