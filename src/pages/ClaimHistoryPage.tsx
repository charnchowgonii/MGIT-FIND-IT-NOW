import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Navigate } from "react-router-dom";

const ClaimHistoryPage = () => {
  const [claims, setClaims] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchAll = async () => {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData?.user);

      // Fetch claims, items, profiles
      const { data: claimsData } = await supabase.from("claims").select("*");
      setClaims(claimsData || []);

      const { data: itemsData } = await supabase.from("items").select("*");
      setItems(itemsData || []);

      const { data: profilesData } = await supabase.from("profiles").select("*");
      setProfiles(profilesData || []);

      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading)
    return (
      <Layout title="Claim History">
        <div className="flex justify-center items-center h-64 text-lg">
          Loading all claim history...
        </div>
      </Layout>
    );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!claims.length)
    return (
      <Layout title="Claim History">
        <div className="flex justify-center items-center h-64 text-lg">
          No claims found.
        </div>
      </Layout>
    );

  const getItem = (itemId: string) => items.find((item: any) => item.id === itemId);
  const getProfile = (userId: string) => profiles.find((profile: any) => profile.id === userId);

  return (
    <Layout title="Claim History">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>All Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-blue-200 rounded-lg">
                <thead>
                  <tr className="bg-blue-100 text-blue-900">
                    <th className="py-2 px-3 border-b">Item</th>
                    <th className="py-2 px-3 border-b">Reporter</th>
                    <th className="py-2 px-3 border-b">Reporter Email</th>
                    <th className="py-2 px-3 border-b">Claimed By</th>
                    <th className="py-2 px-3 border-b">Claimer Email</th>
                    <th className="py-2 px-3 border-b">Claimed At</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim, idx) => {
                    const item = getItem(claim.item_id);
                    const reporter = item ? getProfile(item.user_id) : null;
                    const claimer = getProfile(claim.claimant_id);
                    return (
                      <tr key={idx} className="hover:bg-blue-50">
                        <td className="py-2 px-3 border-b">{item?.name || claim.item_id}</td>
                        <td className="py-2 px-3 border-b">{reporter?.full_name || item?.user_id || "Unknown"}</td>
                        <td className="py-2 px-3 border-b">{reporter?.email || "Unknown"}</td>
                        <td className="py-2 px-3 border-b">{claimer?.full_name || claim.claimant_id || "Unknown"}</td>
                        <td className="py-2 px-3 border-b">{claimer?.email || "Unknown"}</td>
                        <td className="py-2 px-3 border-b text-xs text-gray-500">
                          {claim.created_at ? new Date(claim.created_at).toLocaleString() : "Unknown"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ClaimHistoryPage;