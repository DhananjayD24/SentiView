import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { SavedProductCard } from '@/components/dashboard/SaveProductCard';
import { useAuth } from '@/contexts/AuthContext';
import { dummySavedProducts } from '@/data/dummyData';
import { Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const SavedProducts = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState(dummySavedProducts);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleReanalyze = (id) => {
    toast({
      title: 'Reanalyzing...',
      description: 'Starting fresh analysis for this product.',
    });
  };

  const handleRemove = (id) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: 'Product Removed',
      description: 'Product has been removed from your saved list.',
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Saved Products</h1>
                <p className="text-sm text-muted-foreground">
                  Products you're tracking
                </p>
              </div>
            </div>
            
            <Link to="/analyze">
              <Button variant="glow">
                <Plus className="h-4 w-4" />
                New Analysis
              </Button>
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No saved products</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Save products during analysis to track them here
              </p>
              <Link to="/analyze">
                <Button variant="glow">
                  Start Analyzing
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <SavedProductCard
                  key={product.id}
                  product={product}
                  onReanalyze={handleReanalyze}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SavedProducts;