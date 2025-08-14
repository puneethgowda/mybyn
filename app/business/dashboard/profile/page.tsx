"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Avatar } from "@heroui/avatar";
import { useQuery } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

import { createClient } from "@/supabase/client";
import { getUserOptions } from "@/utils/react-query/user";
import {
  getBusinessProfileOptions,
  useSaveBusinessProfileMutation,
} from "@/utils/react-query/business/profile";
import {
  BusinessProfileFormValues,
  BusinessType,
} from "@/types/business-profile";
import { Constants } from "@/supabase/database.types";
import { getStoragePublicUrlBase } from "@/supabase/storage";

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

  const handleSave = async () => {
    if (!user?.id) return;

    await saveProfileMutation.mutateAsync({
      ...profile,
      owner_id: user.id,
      business_id: businessProfile?.id,
    });
  };

  const handleLogoUpload = async (newFiles: File[]) => {
    const { data, error } = await supabase.storage
      .from("business-profile-images")
      .upload(`${businessProfile?.id}-logo.png`, newFiles[0]);

    if (error)
      return addToast({
        title: "Failed to upload logo",
        description: "Something went wrong. Please try again.",
        color: "danger",
      });
    setProfile({
      ...profile,
      logo_url: getStoragePublicUrlBase(data?.fullPath),
    });
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-base lg:text-xl font-bold">Business Profile</h1>
          <p className="text-default-500 text-xs md:text-sm">
            Manage your business information and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Basic info */}
        <div className="">
          <Card>
            <CardHeader className="flex justify-between">
              <h2 className="text-base md:text-lg font-semibold">
                Business Information
              </h2>
              <Button
                color="primary"
                isLoading={saveProfileMutation.isPending}
                size="sm"
                onPress={handleSave}
              >
                Save Changes
              </Button>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <Avatar
                  className="w-24 h-24 text-2xl bg-primary/10 text-primary"
                  name={profile.name}
                  src={profile.logo_url}
                />
                <div>
                  <Input
                    ref={fileInputRef}
                    className="hidden"
                    type="file"
                    onChange={(e) =>
                      handleLogoUpload(Array.from(e.target.files || []))
                    }
                  />
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={() => {
                      fileInputRef?.current?.click();
                    }}
                  >
                    Change Logo
                  </Button>
                </div>
              </div>

              <Input
                label="Business Name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />

              <Input
                label="Website"
                value={profile.website}
                onChange={(e) =>
                  setProfile({ ...profile, website: e.target.value })
                }
              />

              <Textarea
                label="Business Description"
                minRows={3}
                value={profile.description}
                onChange={(e) =>
                  setProfile({ ...profile, description: e.target.value })
                }
              />

              <Select
                label="Primary Location"
                placeholder="Select location"
                selectedKeys={profile.location ? [profile.location] : []}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    location: e.target.value,
                  })
                }
              >
                {locationOptions.map((location) => (
                  <SelectItem key={location}>{location}</SelectItem>
                ))}
              </Select>
              <Select
                label="Business Type"
                selectedKeys={profile.type ? [profile.type] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0];

                  setProfile({ ...profile, type: selectedKey as BusinessType });
                }}
              >
                {Constants.public.Enums.business_type.map((type) => (
                  <SelectItem key={type}>{type.replace(/_/g, " ")}</SelectItem>
                ))}
              </Select>
            </CardBody>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <h2 className="text-base md:text-lg font-semibold">
              Contact Information
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />

            <Input
              label="Phone"
              type="tel"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
