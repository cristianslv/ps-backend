import { Body, Controller, Post, Get, Param } from "@nestjs/common";
import { Contact } from "@prisma/client";
import { ContactCreationDTO } from "src/dtos/contact-dto";
import { ContactService } from "src/services/contact.service";

@Controller("contact")
export class ContactController {
    constructor(private contactService: ContactService) {}

    @Post()
    async createContact(
        @Body() contactData: ContactCreationDTO,
    ): Promise<Contact> {
        return this.contactService.createContact(contactData);
    }

    @Get("parent/:userId")
    async getByParentID(
      @Param("userId") userId: number,
    ) {
      return this.contactService.getByParentID(userId);
    }

    @Get("teacher/:userId")
    async getByTeacherID(
      @Param("userId") userId: number,
    ) {
      return this.contactService.getByTeacherID(userId);
    }

    @Get("/:parentId/:teacherId")
    async getByContactByParentIDAndTeacherID(
      @Param("parentId") parentId: number,
      @Param("teacherId") teacherId: number
    ): Promise<Contact[]> {
      return this.contactService.getByContactByParentIDAndTeacherID(parentId,teacherId);
    }
}
