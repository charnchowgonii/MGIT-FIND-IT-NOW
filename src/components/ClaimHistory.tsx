import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
interface ClaimHistoryProps {
  itemId: string;
}

const ClaimHistory: React.FC<{ itemId: string }> = ({ itemId }) => {
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      const { data, error } = await supabase
        .from("claims")
        .select(`
          id,
          claimed_at,
          user_id,
          profiles (
            id,
            full_name,
            email
          )
        `)
        .eq("item_id", itemId)
        .order("claimed_at", { ascending: false });

      if (!error && data) setClaims(data);
      setLoading(false);
    };
    fetchClaims();
  }, [itemId]);

  if (loading) return <div>Loading claim history...</div>;
  if (!claims.length) return <div>No claims found for this item.</div>;

  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle>Claim History</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {claims.map((claim, idx) => (
            <li key={idx} className="border-b pb-2">
              <div><strong>Name:</strong> {claim.profiles?.full_name || "Unknown"}</div>
              <div><strong>Email:</strong> {claim.profiles?.email || "Unknown"}</div>
              <div className="text-xs text-gray-500">
                <strong>Claimed at:</strong> {claim.claimed_at ? new Date(claim.claimed_at).toLocaleString() : "Unknown"}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};


export default ClaimHistory;
