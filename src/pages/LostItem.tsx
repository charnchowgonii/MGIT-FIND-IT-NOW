import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateItem } from "@/hooks/useItems";
import { useUserBadges } from "@/hooks/useBadges";
import { useToast } from "@/hooks/use-toast";

const LostItem = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const createItem = useCreateItem();
  const { data: userBadges = [] } = useUserBadges(user?.id);

  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [dateLost, setDateLost] = useState<Date>();
  const [location, setLocation] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  
  // Descriptive questions for verification
  const [itemColor, setItemColor] = useState("");
  const [itemBrand, setItemBrand] = useState("");
  const [itemSize, setItemSize] = useState("");
  const [uniqueFeatures, setUniqueFeatures] = useState("");

  if (loading) {
    return (
      <Layout title="Loading..." userBadges={userBadges}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </Layout>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !dateLost) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createItem.mutateAsync({
        user_id: user.id,
        type: 'lost',
        name: itemName,
        description: itemDescription,
        color: itemColor,
        brand: itemBrand,
        size_dimensions: itemSize,
        unique_features: uniqueFeatures,
        date_lost_found: format(dateLost, 'yyyy-MM-dd'),
        location,
        contact_info: contactInfo,
      });

      toast({
        title: "Success",
        description: "Lost item reported successfully!",
      });

      navigate('/lost-items');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to report lost item",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout title="Report Lost Item" userBadges={userBadges}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-6">Lost Something? Let us Help!</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Item Name:</label>
                  <Input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Item Description:</label>
                  <Textarea
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    className="w-full h-24"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Location Lost:</label>
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full"
                    placeholder="e.g., Library 2nd Floor, Cafeteria"
                    required
                  />
                </div>

                {/* Descriptive Questions Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Item Details for Verification</h3>
                  <p className="text-sm text-gray-600 mb-4">These details will help verify claims from people who find your item.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Primary Color:</label>
                      <Input
                        type="text"
                        value={itemColor}
                        onChange={(e) => setItemColor(e.target.value)}
                        placeholder="e.g., Black, Blue, Red"
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Brand/Make:</label>
                      <Input
                        type="text"
                        value={itemBrand}
                        onChange={(e) => setItemBrand(e.target.value)}
                        placeholder="e.g., Apple, Samsung, Nike"
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Size/Dimensions:</label>
                      <Input
                        type="text"
                        value={itemSize}
                        onChange={(e) => setItemSize(e.target.value)}
                        placeholder="e.g., Large, 15 inch, Small"
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Unique Features:</label>
                      <Input
                        type="text"
                        value={uniqueFeatures}
                        onChange={(e) => setUniqueFeatures(e.target.value)}
                        placeholder="e.g., Stickers, Scratches, Keychain"
                        className="w-full"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Date Lost:</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateLost && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateLost ? format(dateLost, "dd-MM-yyyy") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateLost}
                        onSelect={setDateLost}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Your Contact Info:</label>
                  <Input
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="w-full"
                    placeholder="Phone number or email"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
                  disabled={createItem.isPending}
                >
                  {createItem.isPending ? 'Submitting...' : 'Submit'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LostItem;
