import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ShelfLifeValidator, { ValidationResult } from "./ShelfLifeValidator";
import { Separator } from "@/components/ui/separator";
import MapPopup from "./MapPopup";

interface DonationFormProps {
  onSubmit: (data: DonationFormValues) => void;
}

export interface DonationFormValues {
  title: string;
  description: string;
  foodType: string;
  quantity: string;
  location: string;
  expiry: Date;
  imageUrl: string;
  validationResult?: ValidationResult;
}

const foodTypes = [
  "Prepared Meals",
  "Fresh Produce",
  "Canned Goods",
  "Bread & Baked",
  "Dairy",
  "Meat & Protein",
  "Dry Goods",
  "Beverages",
  "Mixed Items",
];

const quantityOptions = [
  "Small (1-3 meals)",
  "Medium (4-10 meals)",
  "Large (11-25 meals)",
  "Extra Large (25+ meals)",
];

// Placeholder image URLs
const foodImageOptions = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1593759608142-e08b84568198?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
];

const DonationForm = ({ onSubmit }: DonationFormProps) => {
  const [selectedImage, setSelectedImage] = useState(foodImageOptions[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [validationCompleted, setValidationCompleted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const handleLocationSelect = (lat: number, lng: number) => {
    const locationString = `Lat: ${lat}, Lng: ${lng}`;
    setSelectedLocation(locationString);
    setMapOpen(false);
    form.setValue("location", locationString); // Update the form value
  };
  const form = useForm<DonationFormValues>({
    defaultValues: {
      title: "",
      description: "",
      foodType: "",
      quantity: "",
      location: "",
      expiry: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      imageUrl: selectedImage,
    },
  });

  // Update form expiry date when validation suggests a new expiry
  useEffect(() => {
    if (validationResult?.suggestedExpiry) {
      form.setValue("expiry", validationResult.suggestedExpiry);
    }
  }, [validationResult, form]);

  const handleValidationComplete = (result: ValidationResult) => {
    setValidationResult(result);
    setValidationCompleted(true);
  };

  // Enhanced function to handle file upload with better optimization
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Show loading toast for large images
    if (file.size > 1024 * 1024) {
      toast.loading("Processing image, please wait...", {
        id: "image-processing",
        duration: 3000
      });
    }
    
    // Create a new image element to process the file
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (!e.target?.result) {
        toast.error("Failed to read image file");
        return;
      }
      
      // Set the image source to the reader result
      img.src = e.target.result as string;
      
      img.onload = () => {
        try {
          // Create a canvas to resize the image
          const canvas = document.createElement('canvas');
          
          // Calculate new dimensions, keeping aspect ratio
          // Reduce to even smaller dimensions (600x400) for better performance
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > 600) {
              height = Math.round((height * 600) / width);
              width = 600;
            }
          } else {
            if (height > 400) {
              width = Math.round((width * 400) / height);
              height = 400;
            }
          }
          
          // Resize the canvas and draw the image
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            toast.error("Failed to process image");
            return;
          }
          
          // Use better image rendering
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get the resized image as a data URL (JPEG format, lower quality for smaller size)
          const optimizedImage = canvas.toDataURL('image/jpeg', 0.7);
          
          // Dismiss loading toast if it exists
          toast.dismiss("image-processing");
          
          // Set the optimized image as our custom image
          setCustomImage(optimizedImage);
          setSelectedImage(optimizedImage);
          
          toast.success("Image processed successfully");
        } catch (error) {
          console.error("Error processing image:", error);
          toast.error("Failed to process image. Please try another one or use our presets.");
        }
      };
      
      img.onerror = () => {
        toast.error("Failed to load image. Please try another one.");
      };
    };
    
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (data: DonationFormValues) => {
    // Check if validation has been completed
    if (!validationCompleted) {
      toast.error("Please validate your food item before submitting");
      return;
    }

    // Check if validation failed
    if (validationResult && !validationResult.isValid) {
      toast.error(
        "Cannot list expired or unsafe food. Please upload a different item."
      );
      return;
    }

    // Add the selected image URL (either from preset or custom upload)
    data.imageUrl = customImage || selectedImage;
    data.validationResult = validationResult || undefined;

    // Pass the form data to the parent component
    onSubmit(data);

    // Reset the form and image state
    form.reset();
    setValidationResult(null);
    setValidationCompleted(false);
    setCustomImage(null);

    // Show a success toast
    toast.success("Donation listed successfully!");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6 animate-fade-up"
      >
        <div className="space-y-6">
          <ShelfLifeValidator onValidationComplete={handleValidationComplete} />

          <Separator className="my-6" />

          <FormField
            control={form.control}
            name="title"
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="E.g., Fresh sandwich platter"
                    {...field}
                    className="focus-visible:ring-foodshare-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the food items, quantity, and any storage requirements"
                    className="resize-none focus-visible:ring-foodshare-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="foodType"
              rules={{ required: "Food type is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Food Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="focus:ring-foodshare-500">
                        <SelectValue placeholder="Select food type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {foodTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              rules={{ required: "Quantity is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Approximate Quantity</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="focus:ring-foodshare-500">
                        <SelectValue placeholder="Select quantity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {quantityOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* <FormField
            control={form.control}
            name="location"
            rules={{ required: "Pickup location is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pickup Location</FormLabel>
                <FormControl>
                  <Input placeholder="Address or landmark" {...field} className="focus-visible:ring-foodshare-500" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="location"
            rules={{ required: "Location is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pickup Location</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      value={selectedLocation || ""}
                      placeholder="Select location from map"
                      readOnly
                      className="pr-10 focus-visible:ring-foodshare-500 cursor-pointer"
                      onClick={() => setMapOpen(true)}
                    />
                    <MapPin
                      className="absolute right-3 top-2.5 text-foodshare-500 cursor-pointer"
                      onClick={() => setMapOpen(true)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {mapOpen && (
            <MapPopup
              onSelectLocation={handleLocationSelect} // Now correctly expecting two arguments
              onClose={() => setMapOpen(false)}
            />
          )}
          <FormField
            control={form.control}
            name="expiry"
            rules={{ required: "Expiry date is required" }}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expiry Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
                {validationResult?.suggestedExpiry && (
                  <p className="text-xs text-foodshare-600 mt-1">
                    Suggested expiry based on image analysis
                  </p>
                )}
              </FormItem>
            )}
          />

          <div>
            <FormLabel className="block mb-2">Choose an Image</FormLabel>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {foodImageOptions.map((image, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                    selectedImage === image && !customImage
                      ? "border-foodshare-500 ring-2 ring-foodshare-200"
                      : "border-transparent hover:border-foodshare-200"
                  }`}
                  onClick={() => {
                    setSelectedImage(image);
                    setCustomImage(null);
                  }}
                >
                  <img
                    src={image}
                    alt={`Food option ${index + 1}`}
                    className="h-20 w-full object-cover"
                  />
                  {selectedImage === image && !customImage && (
                    <div className="absolute top-1 right-1 bg-foodshare-500 rounded-full w-5 h-5 flex items-center justify-center">
                      <Plus className="h-3 w-3 text-white rotate-45" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Add custom upload option */}
            <div className="flex flex-col items-center space-y-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Upload Your Own Image
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload} 
              />
              
              {/* Display custom image preview if uploaded */}
              {customImage && (
                <div className="relative w-full h-40 rounded-md overflow-hidden border-2 border-foodshare-500">
                  <img 
                    src={customImage} 
                    alt="Custom upload" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-2 right-2 bg-foodshare-500 rounded-full p-1">
                    <Plus className="h-4 w-4 text-white rotate-45" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-foodshare-500 hover:bg-foodshare-600 text-white"
          disabled={
            !validationCompleted ||
            (validationResult && !validationResult.isValid)
          }
        >
          {!validationCompleted
            ? "Validate Food First"
            : validationResult && !validationResult.isValid
            ? "Cannot List Expired Food"
            : "List Donation"}
        </Button>

        {!validationCompleted && (
          <p className="text-xs text-center text-muted-foreground">
            Please validate your food item by uploading an image before listing
          </p>
        )}
      </form>
    </Form>
  );
};

export default DonationForm;
