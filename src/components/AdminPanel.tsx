import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Ban, CheckCircle } from "lucide-react";
import { useDeleteItem, useUpdateItemStatus } from "@/hooks/useItems";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminPanelProps {
  item: any;
}

// Reporter info subcomponent
const ReporterInfo = ({ itemId }) => {
  const [reporter, setReporter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReporter = async () => {
      const { data: item, error: itemError } = await supabase
        .from("items")
        .select("user_id")
        .eq("id", itemId)
        .single();
      if (itemError || !item) {
        setLoading(false);
        return;
      }

      const { data: user, error: userError } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .eq("id", item.user_id)
        .single();

      console.log("ReporterInfo user:", user, "error:", userError); // <--- Add this

      if (!userError && user) setReporter(user);
      setLoading(false);
    };
    fetchReporter();
  }, [itemId]);

  if (loading) return <div className="text-gray-500 text-xs">Loading reporter info...</div>;
  if (!reporter) return <div className="text-gray-500 text-xs">Reporter not found</div>;

  return (
    <div className="p-3 border rounded bg-gray-100 mb-3 text-xs">
      <div className="font-semibold text-sm mb-1">Reporter Details</div>
      <div><strong>Name:</strong> {reporter.full_name || "Unknown"}</div>
      <div><strong>Email:</strong> {reporter.email || "No email"}</div>
      <div><strong>User ID:</strong> {reporter.id}</div>
    </div>
  );
};

// AdminPanel main
const AdminPanel = ({ item }: AdminPanelProps) => {
  const deleteItem = useDeleteItem();
  const updateItemStatus = useUpdateItemStatus();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        await deleteItem.mutateAsync(item.id);
        toast({
          title: "Success",
          description: "Item deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete item",
          variant: "destructive",
        });
      }
    }
  };

  const handleMarkAsSpam = async () => {
    try {
      await updateItemStatus.mutateAsync({ itemId: item.id, status: 'spam' });
      toast({
        title: "Success",
        description: "Item marked as spam",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as spam",
        variant: "destructive",
      });
    }
  };

  const handleReactivate = async () => {
    try {
      await updateItemStatus.mutateAsync({ itemId: item.id, status: 'active' });
      toast({
        title: "Success",
        description: "Item reactivated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reactivate item",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mt-2 border-red-200 bg-red-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-red-800">Admin Controls</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ReporterInfo itemId={item.id} />
        <div className="flex gap-2 text-xs text-gray-600 mb-2">
          <span>Item ID: {item.id}</span>
          <span>•</span>
          <span>Status: {item.status}</span>
        </div>
        <div className="flex gap-2">
           {item.status === 'active' && (
           <Button
              size="sm"
              variant="outline"
              onClick={handleMarkAsSpam}
              className="text-orange-600 border-orange-600 hover:bg-orange-50"
            >
              <Ban className="w-3 h-3 mr-1" />
              Mark Spam
            </Button>
          )}
          {item.status !== 'active' && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleReactivate}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Reactivate
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleDelete}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;