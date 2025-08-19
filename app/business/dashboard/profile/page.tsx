"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { toast } from "sonner";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createClient } from "@/supabase/client";
import { getUserOptions } from "@/utils/react-query/user";
import {
  getBusinessProfileOptions,
  useSaveBusinessProfileMutation,
} from "@/utils/react-query/business/profile";
import { BusinessProfileFormValues } from "@/types/business-profile";
import { Constants } from "@/supabase/database.types";
import { getStoragePublicUrlBase } from "@/supabase/storage";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

// Location options
const locationOptions = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
];

const TypeOptions = Constants.public.Enums.business_type;

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(TypeOptions, {
    error: "Business type is required",
  }),
  location: z.string().min(1, "Location is required"),
  website: z
    .string()
    .min(1, "Website is required")
    .url("Please enter a valid website URL"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z.string().optional(),
  logo_url: z.string().min(1, "Please upload a logo"),
});

type FormValues = z.infer<typeof formSchema>;

export default function BusinessProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<BusinessProfileFormValues>({
    name: "",
    location: "",
    website: "",
    description: "",
    email: "",
    phone: "",
    type: "Retail",
    logo_url: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userData } = useQuery(getUserOptions(supabase));
  const user = userData?.user;

  const { data: businessProfile, isLoading } = useQuery(
    getBusinessProfileOptions(supabase, user?.id as string),
  );

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(() => {
      if (!businessProfile)
        return {
          name: "",
          description: "",
          type: "Retail",
          location: locationOptions[0],
          website: "",
          email: user?.email || "",
          phone: "",
          logo_url: "",
        };

      return {
        name: businessProfile.name || "",
        website: businessProfile.website || "",
        description: businessProfile.description || "",
        location: businessProfile.location || "",
        email: businessProfile.email || user?.email || "",
        phone: businessProfile.phone || "",
        type: businessProfile.type || "",
        logo_url: businessProfile.logo_url || "",
      };
    }, [businessProfile]),
  });

  const saveProfileMutation = useSaveBusinessProfileMutation(supabase);

  // Update form when business profile data loads
  useEffect(() => {
    if (businessProfile) {
      setProfile({
        name: businessProfile.name || "",
        website: businessProfile.website || "",
        description: businessProfile.description || "",
        location: businessProfile.location || "",
        email: businessProfile.email || user?.email || "",
        phone: businessProfile.phone || "",
        type: businessProfile.type || "",
        logo_url: businessProfile.logo_url || "",
      });
    } else if (user && !isLoading) {
      // Set default email from user if no profile exists
      setProfile((prev) => ({
        ...prev,
        email: user.email || "",
      }));
    }
  }, [businessProfile, user, isLoading]);

  // Validate current step
  const validateStep = async () => {
    return await form.trigger([
      "name",
      "description",
      "type",
      "location",
      "website",
      "email",
      "phone",
      "logo_url",
    ]);
  };

  const handleSave = async (data: FormValues) => {
    if (!user?.id) return;

    if (!(await validateStep())) return null;

    await saveProfileMutation.mutateAsync({
      ...data,
      phone: data?.phone as string,
      owner_id: user.id,
      business_id: businessProfile?.id,
    });
  };

  // Handle logo upload
  const handleLogoUpload = async (file: File) => {
    try {
      const { data, error } = await supabase.storage
        .from("business-profile-images")
        .upload(`${user?.id}-logo.png`, file, {
          upsert: true,
        });

      if (error) throw error;

      const logoUrl = getStoragePublicUrlBase(data?.fullPath);

      form.setValue("logo_url", logoUrl);
    } catch (error) {
      toast.error("Failed to upload logo");
    }
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <ScrollArea className="flex-1 [&>div>div]:h-full w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
      <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Page intro */}
          <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-base lg:text-xl font-bold">
                  Business Profile
                </h1>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Manage your business information and preferences
                </p>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)}>
              <Card>
                <CardHeader className="flex justify-between">
                  <h2 className="text-base md:text-lg font-semibold">
                    Business Information
                  </h2>
                  <Button
                    color="primary"
                    disabled={saveProfileMutation.isPending}
                    size="sm"
                    type="submit"
                  >
                    Save Changes
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center gap-4">
                    <FormField
                      control={form.control}
                      name="logo_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex flex-col items-center gap-4">
                              {field.value ? (
                                <Avatar className="w-32 h-32">
                                  <AvatarImage
                                    alt="Business Logo"
                                    src={field.value}
                                  />
                                  <AvatarFallback>LOGO</AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                                  <svg
                                    className="text-muted-foreground"
                                    fill="none"
                                    height="40"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    width="40"
                                  >
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                  </svg>
                                </div>
                              )}
                              <input
                                ref={fileInputRef}
                                accept="image/*"
                                className="hidden"
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];

                                  if (file) handleLogoUpload(file);
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                {field.value ? "Change Logo" : "Upload Logo"}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-center" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">
                          Business Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Acme Corporation"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">
                          Business Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[100px]"
                            placeholder="Describe what your business does..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">
                          Website
                        </FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Input
                              {...field}
                              className=""
                              placeholder="https://business.com"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">
                          Business Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="contact@example.com"
                            type="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">
                          Phone Number (optional)
                        </FormLabel>
                        <FormControl>
                          <div className="flex">
                            <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                              +91
                            </span>
                            <Input
                              {...field}
                              className="rounded-l-none"
                              maxLength={10}
                              placeholder="8888888888"
                              type="tel"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">
                          Primary Location
                        </FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locationOptions.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
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
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">
                          Business Type
                        </FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TypeOptions.map((type) => (
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
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </ScrollArea>
  );
}
