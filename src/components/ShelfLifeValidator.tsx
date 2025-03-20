
import { useState } from "react";
import { Upload, Check, AlertCircle, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ShelfLifeValidatorProps {
  onValidationComplete: (validationResult: ValidationResult) => void;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
  detectedDate?: string;
  suggestedExpiry?: Date;
}

const ShelfLifeValidator = ({ onValidationComplete }: ShelfLifeValidatorProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploading(true);
    
    // Read the file and convert to data URL
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
      setIsUploading(false);
      
      // Start mock validation process
      validateImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validateImage = (imageData: string) => {
    setValidationStatus('validating');
    
    // Mock validation process (simulating AI analysis)
    setTimeout(() => {
      // Generate random result for demo purposes - in production this would be real AI analysis
      const randomSuccess = Math.random() > 0.3;
      
      if (randomSuccess) {
        // Mock a successful validation
        const today = new Date();
        const manufacturingDate = new Date(today);
        manufacturingDate.setDate(today.getDate() - Math.floor(Math.random() * 3)); // 0-2 days ago
        
        const suggestedExpiry = new Date(today);
        suggestedExpiry.setDate(today.getDate() + 2 + Math.floor(Math.random() * 5)); // 2-7 days from now
        
        const result: ValidationResult = {
          isValid: true,
          message: "Food item is valid for donation",
          detectedDate: manufacturingDate.toLocaleDateString(),
          suggestedExpiry: suggestedExpiry
        };
        
        setValidationStatus('valid');
        onValidationComplete(result);
        toast.success("Food verified as safe for donation");
      } else {
        // Mock a failed validation
        setValidationStatus('invalid');
        onValidationComplete({
          isValid: false,
          message: "The image appears to show expired food or an invoice older than 3 days"
        });
        toast.error("This food item may not be suitable for donation");
      }
    }, 2000); // Simulate processing time
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="text-center">
          <h3 className="text-lg font-medium">Shelf Life Validator</h3>
          <p className="text-sm text-muted-foreground">
            Upload an image of the food item or invoice for validation
          </p>
        </div>
        
        <div className="w-full">
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          
          {!uploadedImage ? (
            <label 
              htmlFor="image-upload" 
              className="block w-full h-40 border-2 border-dashed rounded-md cursor-pointer bg-secondary/30 border-secondary hover:bg-secondary/50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {isUploading ? "Uploading..." : "Click to upload an image"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Supported formats: JPEG, PNG
                </span>
              </div>
            </label>
          ) : (
            <Card className="relative overflow-hidden p-0">
              <div className="aspect-video bg-secondary/30 rounded-md overflow-hidden">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded food" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div 
                className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity ${
                  validationStatus === 'validating' ? 'opacity-70' : 'opacity-0'
                }`}
              >
                {validationStatus === 'validating' && (
                  <div className="animate-pulse text-white text-center">
                    <p className="font-semibold">Analyzing image...</p>
                    <p className="text-sm">Checking manufacturing date and expiry</p>
                  </div>
                )}
              </div>
              
              {validationStatus !== 'idle' && validationStatus !== 'validating' && (
                <div className={`absolute top-2 right-2 rounded-full p-1 ${
                  validationStatus === 'valid' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {validationStatus === 'valid' 
                    ? <Check className="h-4 w-4 text-white" /> 
                    : <AlertCircle className="h-4 w-4 text-white" />
                  }
                </div>
              )}
            </Card>
          )}
          
          {uploadedImage && (
            <div className="mt-2 flex justify-between">
              <p className="text-sm text-muted-foreground truncate max-w-[50%]">
                {validationStatus === 'validating' 
                  ? "Analyzing image..." 
                  : validationStatus === 'valid'
                    ? "Food validated as safe for donation" 
                    : validationStatus === 'invalid'
                      ? "Validation failed - food may not be suitable" 
                      : "Image uploaded"}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setUploadedImage(null);
                  setValidationStatus('idle');
                }}
              >
                Replace
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {validationStatus === 'valid' && (
        <div className="rounded-md bg-green-50 p-3 border border-green-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Food validated successfully</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>This food appears to be suitable for donation. The suggested expiry date has been applied.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {validationStatus === 'invalid' && (
        <div className="rounded-md bg-red-50 p-3 border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Validation failed</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>This food may not be suitable for donation. Please check that:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Food is not expired</li>
                  <li>Invoice is less than 3 days old</li>
                  <li>Image is clear and shows relevant dates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!uploadedImage && (
        <div className="flex justify-center items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
              <ImageIcon className="h-3 w-3 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">Upload food/invoice image</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
              <AlertCircle className="h-3 w-3 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">AI validates safety</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelfLifeValidator;
