import Layout from "../components/Layout";
const Home = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">About This Website</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            This is the official Lost and Found portal for MGIT students. If you've lost something, report it here. 
            If you've found an item, help others by submitting it.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Lost Something?</h3>
              <p className="text-gray-600 mb-4">
                Report your lost item with detailed description to help others identify it.
              </p>
              <a 
                href="/lost-item" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Report Lost Item
              </a>
            </div>          
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-green-600">Found Something?</h3>
              <p className="text-gray-600 mb-4">
                Help your fellow students by reporting items you've found on campus.
              </p>
              <a 
                href="/found-item" 
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block"
              >
                Report Found Item
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Home;
