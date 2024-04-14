import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatus,
} from "../controllers/contactsControllers.js";

import  validateBody  from '../helpers/validateBody.js'
import isValidId from '../helpers/isValidId.js'

import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from '../schemas/contactsSchemas.js';


const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", isValidId, validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", isValidId, validateBody(updateStatusSchema), updateStatus);

contactsRouter.delete("/:id", isValidId, deleteContact);

export default contactsRouter;
