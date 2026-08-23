import { useState } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClaimItem = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const itemType = searchParams.get("type"); // "lost" or "found"
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const [userColor, setUserColor] = useState("");
  const [userBrand, setUserBrand] = useState("");
  const [userSize, setUserSize] = useState("");
  const [userUniqueFeatures, setUserUniqueFeatures] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    contactInfo?: string;
  } | null>(null);
  // Fetch item data from Supabase
  const { data: itemData, isLoading: itemLoading, error } = useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .eq('type', itemType || 'lost')
        .single();
      
      if (error) {
        console.error('Error fetching item:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!id && !!itemType,
  });
  // Show loading while checking auth status or fetching item
  if (loading || itemLoading) {
    return (
      <Layout title="Loading...">
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
    
    if (!itemData) return;

    // Simple verification logic - check if answers match (case insensitive)
    const colorMatch = userColor.toLowerCase().trim() === itemData.color.toLowerCase();
    const brandMatch = userBrand.toLowerCase().trim() === itemData.brand.toLowerCase();
    const sizeMatch = userSize.toLowerCase().trim() === itemData.size_dimensions.toLowerCase();
    const featuresMatch = userUniqueFeatures.toLowerCase().trim() === itemData.unique_features.toLowerCase();

    const totalMatches = [colorMatch, brandMatch, sizeMatch, featuresMatch].filter(Boolean).length;
    const isVerified = totalMatches >= 3; // Require at least 3 out of 4 correct answers

    if (isVerified) {
      // Create a claim in the database and update item status
      try {
        const { error: claimError } = await supabase
          .from('claims')
          .insert([{
            item_id: itemData.id,
            claimant_id: user.id,
            color_answer: userColor,
            brand_answer: userBrand,
            size_answer: userSize,
            features_answer: userUniqueFeatures,
            is_verified: true,
            verified_at: new Date().toISOString()
          }]);

        if (claimError) {
          console.error('Error creating claim:', claimError);
          toast({
            title: "Error",
            description: "Failed to submit claim. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Update item status to resolved
        const { error: updateError } = await supabase
          .from('items')
          .update({ 
            status: 'resolved',
            updated_at: new Date().toISOString()
          })
          .eq('id', itemData.id);

        if (updateError) {
          console.error('Error updating item status:', updateError);
          toast({
            title: "Error",
            description: "Failed to update item status. Please try again.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Your claim has been verified successfully!",
        });
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    setVerificationResult({
      success: isVerified,
      contactInfo: isVerified ? itemData.contact_info : undefined
    });
    setIsSubmitted(true);
  };

  if (error || !itemData) {
    return (
      <Layout title="Claim Item">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
                <p className="text-gray-600">The item you're trying to claim could not be found or may have been removed.</p>
                <Button 
                  onClick={() => window.history.back()} 
                  className="mt-4"
                >
                  Go Back
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (isSubmitted && verificationResult) {
    return (
      <Layout title="Claim Verification Result">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                {verificationResult.success ? (
                  <>
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-600 mb-4">Verification Successful!</h2>
                    <p className="text-gray-600 mb-6">Your answers match the item description. Here's the contact information:</p>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="font-semibold text-green-800">{verificationResult.contactInfo}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">Please contact the person above to arrange pickup/return.</p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h2>
                    <p className="text-gray-600 mb-4">Your answers don't match the item description closely enough.</p>
                    <p className="text-sm text-gray-500">If you believe this is your item, please try again or contact the administrators.</p>
                    <Button 
                      onClick={() => {
                        setIsSubmitted(false);
                        setVerificationResult(null);
                        setUserColor("");
                        setUserBrand("");
                        setUserSize("");
                        setUserUniqueFeatures("");
                      }}
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Claim Item">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-6">Claim Your Item</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Item: {itemData.name}</h3>
                <p className="text-blue-700 text-sm">
                  To verify this is your item, please answer the following questions about its appearance.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">What is the primary color of this item?</label>
                  <Input
                    type="text"
                    value={userColor}
                    onChange={(e) => setUserColor(e.target.value)}
                    placeholder="Enter the color"
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">What is the brand or make of this item?</label>
                  <Input
                    type="text"
                    value={userBrand}
                    onChange={(e) => setUserBrand(e.target.value)}
                    placeholder="Enter the brand"
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">What is the size or dimensions of this item?</label>
                  <Input
                    type="text"
                    value={userSize}
                    onChange={(e) => setUserSize(e.target.value)}
                    placeholder="Enter the size"
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Describe any unique features, marks, or accessories:</label>
                  <Input
                    type="text"
                    value={userUniqueFeatures}
                    onChange={(e) => setUserUniqueFeatures(e.target.value)}
                    placeholder="Enter unique features"
                    className="w-full"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  Verify and Claim Item
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ClaimItem;
