import { NextFunction, Request, Response, Router } from "express";
import { deleteSound, getAll, getById, getSoundById, getSounds, insert, insertSound, /* replace, */ updateSound } from "../Database/utils";
import { createAuthorizeMiddleWare } from "../Middlewares/authorize.middleware";
import { EntityNotFoundError } from "../Errors/entity-not-found.error";
import multer from "multer";
import { body, check } from 'express-validator';
import { ValidationMiddleware } from "../Middlewares/validation.middleware";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        // ['lapin', 'mp3']
        const fileParts = file.originalname.split('.');
        const extension = fileParts.pop();
        // file.mp3
        // => file-4556466.mp3
        cb(null, `${fileParts.join('.')}-${Date.now()}.${extension}`);
    }
});

const configuredMulter = multer({
    dest: './uploads',
    storage,
})

export const soundRouter = Router();

soundRouter.get('/', createAuthorizeMiddleWare([]), async (request, response) => {
    const sounds = await getSounds();
    response.send(sounds);
})
/* soundRouter.get('/', createAuthorizeMiddleWare([]), async (request, response) => {
    const sounds = await getAll('sounds');
    response.send(sounds);
}) */

soundRouter.get('/list', async (request, response) => {
    const sounds = await getSounds();
    response.render('sound_list', {
        sounds,
    });
})
/* soundRouter.get('/list', async (request, response) => {
    const sounds = await getAll('sounds');
    response.render('sound_list', {
        sounds,
    });
}) */

soundRouter.get('/:id', createAuthorizeMiddleWare([]), async (request: Request, response: Response, next: NextFunction) => {
    const sound = await getSoundById(Number(request.params.id));
    if (!sound) {
        return next(new EntityNotFoundError('banane'));
    }
    response.send(sound);
});
/* soundRouter.get('/:id', createAuthorizeMiddleWare([]), async (request: Request, response: Response, next: NextFunction) => {
    const sound = await getById('sounds', request.params.id);
    if (!sound) {
        return next(new EntityNotFoundError('banane'));
    }
    response.send(sound);
}); */

const uploadValidation = [
    body('name').notEmpty(),
    body('category').notEmpty(),
    // on vérifie que c'est un audio/mpeg => mp3
    body('files.*.mimetype').isIn(['audio/mpeg'])
];

// array => multiple
soundRouter.post('/', configuredMulter.array('sound'), (req, _res, next) => {
    // petit hack qui permet de valider avec express-validator. On met le file dans le body
    req.body.files = req.files; // => tableau de fichiers 
    // on passe à la suite => ...uploadValidation
    next();
} , ...uploadValidation, ValidationMiddleware, async (request, response) => {
    // soit un objet de files, soit un tableau de files. On doit utiliser une assertion pour lui indiquer le bon type.
    const files = request.files as Express.Multer.File[];

    for (const file of files) {
        // truc.mp3
        const fileName = file.filename.split('.');
        // => ['truc', 'mp3']
        fileName.pop();
        // => ['truc']
        /* await insert('sounds', {
            id: new Date().getTime().toString(),
            name: `${request.body.name}-${fileName.join('.')}`,
            category: request.body.category,
            // filename à la place de originalName pour avoir le nom du fichier final qui sera stocké sur le disque
            file: file.filename,
        }); */
        const name = `${request.body.name}-${fileName.join('.')}`;
        const category = request.body.category;
        await insertSound(name,category,file.filename);
    }

    response.redirect('/sounds/list');
})

soundRouter.put('/:id', configuredMulter.single('sound'), async (request, response) => {
    await updateSound(Number(request.params.id), {
        ...request.body,
        file: request.file?.originalname,
    });
    response.redirect('/sounds/list');
})

// Les formulaires en html n'accepte que les method post et get. Pour pas écrire un fetch,
// Nous avons fait un post /:id qui se comporte comme un put.
soundRouter.post('/:id', configuredMulter.single('sound'), async (request, response) => {
    await updateSound(Number(request.params.id), {
        ...request.body,
        file: request.file?.filename,
    });
    response.redirect('/sounds/list');
})
/* soundRouter.post('/:id', configuredMulter.single('sound'), async (request, response) => {
    await replace('sounds', request.params.id, {
        ...request.body,
        file: request.file?.originalname,
    });
    response.redirect('/sounds/list');
}) */

soundRouter.delete('/:id', async (request, response) => {
    await deleteSound(Number(request.params.id));
    response.status(204).send(null);
})
