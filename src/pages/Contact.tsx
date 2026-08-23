
import Layout from "../components/Layout";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  return (
    <Layout title="Contact Us">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                <p className="text-gray-600">
                  If you have any questions, please reach out to us at:
                </p>
                
                <div className="space-y-2">
                  <p className="text-lg">
                    <strong>Email:</strong> lostandfound@mgit.edu
                  </p>
                  <p className="text-lg">
                    <strong>Phone:</strong> +91 9999999999
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
