import { Router } from "express";
import { deleteEntity, getAll, getById, insert, update } from "../Database/utils";

export const userRouter = Router();

userRouter.get('/', async (request, response) => {
    const allUsers = await getAll('users');
    response.send(allUsers);
})

userRouter.get('/list', async (request, response) => {
   const users = await getAll("users");  
   response.render("user_list", {
        users,
        isCurrentRole: () => function (placeholder: string, render: Function) {
            const [currentRole, testedRole] = render(placeholder).trim().split(" ");
            if (currentRole === testedRole) {
                return "disabled";
            }
            return "";
        }
   })
})

userRouter.get('/:id', async (request, response, next) => {
    try {
        const user = await getById('users', request.params.id);
        response.send(user);
    } catch(err) {
        next(err);
    }
})

userRouter.post('/', async (request, response) => {
    response.send(await insert('users', request.body));
})

userRouter.patch('/:id', async (request, response, next) => {
    try {
        const user = await update('users', request.params.id, request.body);
        response.send(user);
    } catch(err) {
        next(err);
    }
})

userRouter.delete('/:id', async (request, response) => {
    await deleteEntity('users', request.params.id);
    response.status(204).send(null);
})