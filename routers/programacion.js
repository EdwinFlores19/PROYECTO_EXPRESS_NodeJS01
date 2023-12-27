const express = require('express');

const { programacion } = require('../datos/cursos.js').infoCursos;

const routerProgramacion = express.Router();

//Middleware intemediario / next()
routerProgramacion.use(express.json());

//Programacion

routerProgramacion.get('/', (req, res) => {
    res.send(JSON.stringify(programacion));
    //JSON.stringify no es necesario
    //ya que res.send() lo manda como JSOn automaticamente
    //también podría usarse .json

    //send acepta buffer, string, objeto o array
    // y configura el contenido automaticamente

    //json. transforma a json antes de ser enviado, 
    //garantiza el formato sin importar el argumento 

});

routerProgramacion.get('/:lenguaje', (req, res) => {
    const lenguaje = req.params.lenguaje;
    const resultados = programacion.filter(curso => curso.lenguaje === lenguaje);

    if (resultados.length === 0) {
        return res.status(204).send(`No se encontraron cursos de ${lenguaje}`);
        //204 = no content

        //da una respuesta vacía
        //return res.status(404).end();
    }
    if (req.query.ordenar === 'vistas') {
        return res.send(JSON.stringify(resultados.sort((a, b) => b.vistas - a.vistas)))
    }
    res.send(JSON.stringify(resultados));
});

routerProgramacion.get('/:lenguaje/:nivel', (req, res) => {
    const lenguaje = req.params.lenguaje;
    const nivel = req.params.nivel;
    const resultados = programacion.filter(curso => curso.lenguaje === lenguaje && curso.nivel === nivel);

    if (resultados.length === 0) {
        return res.status(404).send(`No se encontraron cursos de ${lenguaje} de nivel ${nivel}`);
    }
    res.send(JSON.stringify(resultados));
})


routerProgramacion.post('/', (req, res) => {
    let cursoNuevo = req.body;
    programacion.push(cursoNuevo);
    res.send(JSON.stringify(programacion));
});

routerProgramacion.put('/:id', (req, res) => {
    const cursoActualizado = req.body;
    const id = req.params.id;

    const indice = programacion.findIndex(curso => curso.id == id);

    if (indice >= 0) {
        programacion[indice] = cursoActualizado;
    } else {
        return res.status(404).send(`No se encontraron cursos con indice ${indice}`);
    }
    res.send(JSON.stringify(programacion));

});

routerProgramacion.patch('/:id', (req, res) => {
    const infoActualizada = req.body;
    const id = req.params.id;

    const indice = programacion.findIndex(curso => curso.id == id);

    if (indice >= 0) {
        const cursoAModificar = programacion[indice];
        Object.assign(cursoAModificar, infoActualizada);
    } else {
        return res.status(404).send(`No se encontraron cursos con indice ${indice}`);
    }
    res.send(JSON.stringify(programacion));
});

routerProgramacion.delete('/:id', (req, res) => {
    const id = req.params.id;

    const indice = programacion.findIndex(curso => curso.id == id);

    if (indice >= 0) {
        programacion.splice(indice, 1);
    } else {
        return res.status(404).send(`No se encontraron cursos con indice ${indice}`);
    }
    res.send(JSON.stringify(programacion));
})

module.exports = routerProgramacion;