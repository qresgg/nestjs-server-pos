import {Staff} from "../../staff/entities/staff.entity";

export const buildOriginEmployee = (empl: Staff) => {
    return {
        id: empl.id,
        firstName: empl.firstName,
        lastName: empl.lastName,
        role: empl.role
    }
}