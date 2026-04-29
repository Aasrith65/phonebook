"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  CONTACT_CATEGORIES,
  type ContactCategory,
} from "@/lib/contact-categories";

export type SaveContactState = {
  status: "idle" | "success" | "error";
  message: string;
};

const MAX_FIELD_LENGTH = 250;
const MAX_COMMENT_LENGTH = 1000;

function getTrimmedValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizePhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/\s+/g, "");
}

function isValidPhoneNumber(phoneNumber: string) {
  return /^[+\d][\d().\-\s]{5,20}$/.test(phoneNumber);
}

export async function saveContact(
  _previousState: SaveContactState,
  formData: FormData
): Promise<SaveContactState> {
  const name = getTrimmedValue(formData, "name");
  const organization = getTrimmedValue(formData, "organization");
  const categoryInput = getTrimmedValue(formData, "category");
  const rawPhoneNumber = getTrimmedValue(formData, "phoneNumber");
  const designation = getTrimmedValue(formData, "designation");
  const address = getTrimmedValue(formData, "address");
  const comments = getTrimmedValue(formData, "comments");
  const phoneNumber = normalizePhoneNumber(rawPhoneNumber);
  const category = CONTACT_CATEGORIES.includes(categoryInput as ContactCategory)
    ? (categoryInput as ContactCategory)
    : "Others";

  if (!name || !phoneNumber) {
    return {
      status: "error",
      message: "Name and phone number are required.",
    };
  }

  if (!isValidPhoneNumber(rawPhoneNumber)) {
    return {
      status: "error",
      message: "Please enter a valid phone number.",
    };
  }

  if (
    name.length > MAX_FIELD_LENGTH ||
    organization.length > MAX_FIELD_LENGTH ||
    phoneNumber.length > MAX_FIELD_LENGTH ||
    designation.length > MAX_FIELD_LENGTH ||
    address.length > MAX_FIELD_LENGTH
  ) {
    return {
      status: "error",
      message: "One or more fields are too long.",
    };
  }

  if (comments.length > MAX_COMMENT_LENGTH) {
    return {
      status: "error",
      message: "Comments can be up to 1000 characters.",
    };
  }

  try {
    await prisma.contact.create({
      data: {
        name,
        organization: organization || null,
        category,
        phoneNumber,
        designation: designation || null,
        address: address || null,
        comments: comments || null,
      },
    });
  } catch {
    return {
      status: "error",
      message: "Unable to save contact right now. Please try again.",
    };
  }

  revalidatePath("/phonebook");

  return {
    status: "success",
    message: "Contact saved successfully.",
  };
}
