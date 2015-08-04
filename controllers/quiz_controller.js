//GET /quizes/question
/*exports.question = function(req,res){
	res.render('quizes/question',{pregunta: 'Capital de Italia'});
};
exports.author = function(req,res){
	res.render('quizes/author',{title: 'autor'});
};
//GET /quizes/answer

exports.answer = function(req,res){
	if ( req.query.respuesta ==='Roma'){
		res.render('quizes/answer',{respuesta: 'Correcto'});
	} else{
		res.render('quizes/answer',{respuesta: 'Incorrecto'});
	}
};*/
var models = require('../models/models.js');

// Autoload - factoría el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
   function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{next(new Error('No existe quizId=' + quizId))}
    }
  ).catch(function(error) {next(error)});
};

// GET /quizes
exports.index = function(req,res) {
   models.Quiz.findAll().then(
    function(quizes) {
	res.render('quizes/index',{quizes: quizes, errors: []})
	}
	).catch(function(error) {next(error);})
};

// GET /quizes/:id
exports.show = function(req,res) {
  var quiz = req.quiz; // autoload de instancia quiz
  res.render('quizes/show',{quiz: req.quiz, errors: []});
};
//get /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build(//crea objeto
		{pregunta: "pregunta", respuesta:"Respuesta"}
		);
	res.render('quiezes/new', {quiz: quiz, errors: []});
	
};
exports.create = function(req, res) {
  var quiz = models.Quiz.build(req.body.quiz);
  
  console.log(req);
  console.log('Valor:');
  console.log(quiz);
  
     /*quiz.save({fields: ['pregunta', 'respuesta', 'tema']}).then(function(){
        res.redirect('/quizes');
      });*/
  
  quiz
  .validate()
  .then(function(err){
    if(err) {
      res.render('quizes/new', {quiz: quiz, errors: err.errors})
    } else {
      quiz.save({fields: ['pregunta', 'respuesta', 'tema']}).then(function(){
        res.redirect('/quizes');
      });
    }
  });
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer',  { quiz: req.quiz,  respuesta: resultado , errors: []});
};
//Quiz Edit
exports.edit = function(req, res) {
  var quiz = req.quiz;

  res.render('quizes/edit', {quiz: quiz, errors: []});  
};
//Quiz Update
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

    req.quiz
      .validate()
      .then(function(err){
        if(err) {
          res.render('quizes/edit', {quiz: req.quiz, errors: err.errors})
        } else {
          req.quiz.save({fields: ['pregunta', 'respuesta', 'tema']}).then(function(){
            res.redirect('/quizes');
          });
        }
      });
    };
   //Quiz Destroy
exports.destroy = function(req, res) {
  req.quiz.destroy().then(function(){
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};
