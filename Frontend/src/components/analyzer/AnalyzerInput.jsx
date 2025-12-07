import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link2, FileText, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AnalyzerInput({ onAnalyze, isLoading }) {
  const [mode, setMode] = useState('link');
  const [linkInput, setLinkInput] = useState('');
  const [pasteInput, setPasteInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = mode === 'link' ? linkInput : pasteInput;
    if (input.trim()) {
      onAnalyze(input, mode);
    }
  };

  const isInputValid = mode === 'link' ? linkInput.trim().length > 0 : pasteInput.trim().length > 0;

  return (
    <div className="glass-card p-6 md:p-8 animate-slide-up">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('link')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            mode === 'link'
              ? "bg-primary/20 text-primary border border-primary/30"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          <Link2 className="h-4 w-4" />
          Product Link
        </button>
        <button
          onClick={() => setMode('paste')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            mode === 'paste'
              ? "bg-primary/20 text-primary border border-primary/30"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          <FileText className="h-4 w-4" />
          Paste Reviews
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'link' ? (
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Enter product URL (Amazon, Flipkart, etc.)
            </label>
            <Input
              type="url"
              placeholder="https://www.amazon.com/product/..."
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              className="h-12"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Paste reviews (one per line or separated by newlines)
            </label>
            <Textarea
              placeholder="Great product! I love it...&#10;Not satisfied with the quality...&#10;It works as expected..."
              value={pasteInput}
              onChange={(e) => setPasteInput(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
        )}

        <Button
          type="submit"
          variant="hero"
          size="lg"
          className="w-full"
          disabled={!isInputValid || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Analyzing Reviews...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Analyze Sentiment
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
