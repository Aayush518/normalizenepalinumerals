"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { normalizeNumbers } from "@/lib/utils/text-processing";
import { Flag, RotateCw, Copy, Check, Upload, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export function NumberConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleConvert = () => {
    try {
      const result = normalizeNumbers(input);
      setOutput(result);
    } catch (error) {
      setOutput("माफ गर्नुहोस्, रूपान्तरण गर्न सकिएन। कृपया वाक्य जाँच गरी पुन: प्रयास गर्नुहोस्।");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    inputRef.current?.focus();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      // Prevent cursor jumping by using a ref
      if (inputRef.current) {
        const start = inputRef.current.selectionStart;
        const end = inputRef.current.selectionEnd;
        setTimeout(() => {
          inputRef.current?.setSelectionRange(start, end);
        }, 0);
      }
    } catch (err) {
      console.error("Failed to paste text:", err);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInput(text);
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    if (!output) return;

    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted_nepali_text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-8 max-w-4xl mx-auto">
      <Card className="p-6 nepali-border">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary">तपाईंको वाक्य लेख्नुहोस्</h2>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={handlePaste} className="text-sm">
                क्लिपबोर्डबाट कपि गर्नुहोस्
              </Button>
              <Button
                variant="ghost"
                className="text-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                फाइल अपलोड
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt"
                className="hidden"
              />
            </div>
          </div>
          
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData('text');
              const target = e.target as HTMLTextAreaElement;
              const start = target.selectionStart;
              const end = target.selectionEnd;
              setInput(
                input.substring(0, start) + 
                text + 
                input.substring(end)
              );
              // Maintain cursor position
              setTimeout(() => {
                target.setSelectionRange(start + text.length, start + text.length);
              }, 0);
            }}
            placeholder="कृपया नेपाली अंक भएको वाक्य यहाँ लेख्नुहोस् वा कपि गर्नुहोस्..."
            className="min-h-[150px] text-lg leading-relaxed"
          />
          
          <div className="flex gap-4">
            <Button 
              onClick={handleConvert} 
              className="flex-1 gap-2 bg-primary hover:bg-primary/90"
            >
              <Flag className="h-4 w-4" />
              अक्षरमा रूपान्तरण गर्नुहोस्
            </Button>
            <Button 
              onClick={handleClear} 
              variant="outline" 
              className="flex-1 gap-2"
            >
              <RotateCw className="h-4 w-4" />
              सबै मेटाउनुहोस्
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 nepali-border">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary">रूपान्तरित वाक्य</h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={handleCopy}
                disabled={!output}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "कपि गरियो" : "कपि गर्नुहोस्"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={handleDownload}
                disabled={!output}
              >
                <Download className="h-4 w-4" />
                डाउनलोड
              </Button>
            </div>
          </div>
          
          <Textarea
            value={output}
            readOnly
            className={cn(
              "min-h-[250px] text-lg leading-relaxed whitespace-pre-wrap font-mukta",
              output && "bg-muted"
            )}
            placeholder="रूपान्तरित वाक्य यहाँ देखिनेछ..."
          />
        </div>
      </Card>
    </div>
  );
}