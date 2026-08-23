import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import AdminPanel from "../components/AdminPanel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useItems, SortOption, useDeleteItem } from "@/hooks/useItems";
import { useAuth } from "@/contexts/AuthContext";
import { useUserBadges } from "@/hooks/useBadges";
import { useIsAdmin } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

const LostItems = () => {
  const [sortBy, setSortBy] = useState<SortOption>("date-lost");
  const [showAll, setShowAll] = useState(false);
  const { user } = useAuth();
  const { data: userBadges = [] } = useUserBadges(user?.id);
  const { isAdmin, isLoading: roleLoading } = useIsAdmin();
  const { data: lostItems = [], isLoading } = useItems('lost', sortBy, showAll && isAdmin);
  const deleteItemMutation = useDeleteItem();
  const { toast } = useToast();

  const handleRemoveItem = async (itemId: string) => {
    try {
      await deleteItemMutation.mutateAsync(itemId);
      toast({
        title: "Success",
        description: "Item removed successfully",
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  if (isLoading || roleLoading) {
    return (
      <Layout title="Lost Items" userBadges={userBadges}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Lost Items" userBadges={userBadges}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">All Lost Items</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Sort by:</span>
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-lost">Date Lost</SelectItem>
                  <SelectItem value="item-name">Item Name</SelectItem>
                  <SelectItem value="date-reported">Date Reported</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Show all items:</span>
                <Switch
                  checked={showAll}
                  onCheckedChange={setShowAll}
                />
              </div>
            )}
          </div>
          {isAdmin && showAll && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-yellow-800 text-sm">
                <strong>Admin Mode:</strong> Viewing all items including resolved and spam reports.
              </p>
            </div>
          )}
        </div>

        <Card>
          <CardContent className="p-6">
            {lostItems.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Date Lost</TableHead>
                    <TableHead>Location</TableHead>
                    {isAdmin && showAll && <TableHead>Status</TableHead>}
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lostItems.map((item) => (
                    <>
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{format(new Date(item.date_lost_found), 'dd-MM-yyyy')}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        {isAdmin && showAll && (
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${
                              item.status === 'active' ? 'bg-green-100 text-green-800' :
                              item.status === 'resolved' ? 'bg-blue-100 text-blue-800' :
                              item.status === 'spam' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex gap-2">
                            {item.status === 'active' && (
                              <Link to={`/claim-item/${item.id}?type=lost`}>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  Found This?
                                </Button>
                              </Link>
                            )}
                            {user && item.user_id === user.id && item.status === 'resolved' && (
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={deleteItemMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                {deleteItemMutation.isPending ? 'Removing...' : 'Remove'}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      {isAdmin && (
                        <TableRow>
                          <TableCell colSpan={isAdmin && showAll ? 5 : 4} className="p-0">
                            <AdminPanel item={item} />
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-gray-600 py-8">
                <p>No lost items found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LostItems;