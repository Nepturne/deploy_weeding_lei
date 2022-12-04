const express              = require('express');
const app                  = express();
const bodyParser           = require("body-parser");
const connection           = require("./database/database");
const session              = require("express-session");
// Sessions
app.use(session({secret:'3s@dgsdg5r@335735@-@p-@;cazs@a*-+asz@'}));
//=================================================================================================
// Uploads
const multer               = require("multer");
const storage              = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/listadepresentes/')
  },
  filename: (req, file , cb) => {
    cb(null, file.originalname)
  }
});
const upload               = multer({ storage });
// PORTA===========================================================================================
const PORT                 = process.env.PORT || 5000;

// Models [Represent for Tables] - Da aplicação:---------------------------------------------------
const Contribuinte = require("./models/Contribuinte/Contribuinte.js");
const Caixa        = require("./models/Caixa/Caixa.js");
const Arrecadacoes = require("./models/Arrecadacoes/Arrecadacoes.js");
const Presente     = require("./models/Presente/Presente.js");

// Database:---------------------------------------------------------------------------------------
// Conexão com o banco de dados:
connection
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados efetuada com sucesso!");
  })
  .catch((msgError) => {
    console.log(msgError);
  });
// -----------------------------------------------------------------------------------------------

// Configurações ---------------------------------------------------------------------------------
app.set("view engine", "ejs"); // Declara ao Express que o EJS é o View Engine:
app.use(express.static("public")); // Permite a aplicação usar arquivos estáticos na pasta 'public'
app.use(bodyParser.urlencoded({ extended: false })); // Faz a decodificação dos dados vindos do form em um formato JS para poder ser utilizado pelo backend.
app.use(bodyParser.json()); // Permite que o express leia dados vindos do formulário no formato JSON.
// Configurações ---------------------------------------------------------------------------------

//=================================================
app.get("/", (req, res) => {
  
   // Cria o caixa da Aplicação
  Caixa.findAndCountAll({
    caixa: 0
  }).then( (caixaCriado) => {
    if(caixaCriado.count === 1) {
      res.render('index.ejs');
    } else {
        Caixa.create({
          caixa: 0
        }).then(() => {
          res.render('index.ejs');
        });
    }
  });
  //----------------------------------

});
//=================================================

app.get("/login" ,(req,res) => {
   res.render('src/login/login.ejs');
});


app.post("/authenticate" ,(req,res) => {
  const grau       = req.body.parentesco;
  const codigo     = req.body.codigo;
  const nome       = req.body.nome;
  const telefone   = req.body.telefone;
  const padrinho   = req.body.padrinho;

  if(padrinho == "Bruna e Bruno"){
    var foto = "brunabruno.jpeg";
  }
  else if(padrinho == "Rosana e Alysson"){
    var foto = "alysson.jpeg";
  }
  else if(padrinho == "Thaís e Eber"){
    var foto = "eber.jpeg";
  }
  else if(padrinho == "Inay e Jadiel"){
    var foto = "inayjadiel.jpeg";
  }
  else if(padrinho == "Ingrid e Jardel"){
    var foto = "ingrdjardel.jpeg";
  }
  else if(padrinho == "Vanessa e Léo"){
    var foto = "leovanessa.jpeg";
  }
  else if(padrinho == "Neila e Júlio"){
    var foto = "juliocezar.jpeg";
  }
  else{
    res.redirect("/login");
  }



  // Caso seja padrinho: CODPALUEI
  if (grau === 'Padrinho' && codigo === 'CODPALUEI') {
    const data = [{
      padrinho: padrinho,
      tel: telefone,
      foto: foto,
    }];

    req.session.geral = data;

    res.render('src/padrinhos/index.ejs',{
      padrinho: padrinho,
      tel: telefone,
      foto: foto
    });
  }
  // Se for padrinho abriremos uma página com dados específicos para
  // eles, com a cor das roupas, qual vai ser a postura e que horas
  // como tudo irá acontecer;

  // Caso seja Convidado: CONVLEI
  else if(grau === 'Convidado' && codigo === 'CONVLEI'){
    
    const data = {
      grau : grau,
      nome: nome,
      tel: telefone
    };

    req.session.geral = data;

    Presente.findAll().then((presentes) => {
      res.render('src/lista/index.ejs',{
        data : data,
        grau: data.grau,
        nome: nome,
        presentes: presentes,
        tel: telefone
      });
  });

  }

  else {
    res.redirect('/login');
  }

});

app.get("/pageex" ,(req,res) => {
  res.render('src/padrinhos/groom-bride.ejs');
});

app.get("/listadepresentes" ,(req,res) => {
  var sessaoapply = req.session.geral;
  // [{ grau: 'Convidado' , nome: 'Everton'}]
  Presente.findAll().then((presentes) => {
    res.render('src/lista/index.ejs',{
      presentes: presentes,
      nome: sessaoapply.nome,
      grau: sessaoapply.grau,
      tel: req.session.geral.tel
    });
  });

});

// Destroy da Sessão==================================
app.get("/logout" ,(req,res) => {
  req.session.destroy();
  res.redirect('/login');
});

//=====================================================
app.post("/processarPagamento",(req,res) => {
  var idDoPresente = req.body.id_presente; 
  var parentesco  = req.session.geral.grau; 
  var nome_produto = req.body.nome_produto_applied;
  var nome_contrib = req.body.nome_parente;
  var depositoPix = req.body.depositoPix;
  var telefone    = req.body.telefone; 

  // Salvar Contribuinte
  Contribuinte.create({
        codigo_acesso: parentesco,
        nome_produto: nome_produto,
        nome_contrib: nome_contrib,
        telefone: telefone,
        valor_contrib: depositoPix
    }).then(() => {
      console.log("-> Contribuição efetuada com sucesso!")
    // Início Presente======================================================
    Presente.findOne({
      where: { id: idDoPresente }
    }).then((presente) =>{
    
      valor_abatido = presente.falta - depositoPix;

      Presente.update({ falta: valor_abatido } ,{ 
        where: {id: idDoPresente} 
      }).then( () => {

        // Início Caixa====================================================
        Caixa.findOne({
          where: { id: 1 },
        }).then((caixa) => {
        var valorCaixaApply = caixa.valor_caixa;
        var calculo = Number(valorCaixaApply) + Number(depositoPix);
        // Da entrada de dinheiro no caixa
          Caixa.update({ valor_caixa: calculo } , {
            where:{
              id: caixa.id
            }
          }).then( () => {
            res.redirect("/listadepresentes");
          }).catch( (err) => {  
            console.log(err);
            res.redirect("/login");
          });


        }); 
        // FIM CAIXA=====================================================




      });


    }); 
    // Fim Atualizar Presente ===========================================
//=======================================================================  
}); // Fim Contribuinte
//=======================================================================   
});

//=======================================================================

// Área Administrativa -> Vermos as doações 
app.get("/gerencialogin" ,(req,res) => {
  res.render('src/login/loginadmin.ejs');
});

app.post("/authenticateadmin" ,(req,res) => {
  const login = req.body.login;
  const pass  = req.body.pass;

  if (login === 'admin' && pass === 'ilanaelucas987') {
    Caixa.findOne({
      where: { id: 1 },
    }).then((caixa) => {

      res.render('src/admin/index.ejs',{
        login: login,
        pass: pass,
        caixa: caixa.valor_caixa
      });
    });

  } else {
    res.redirect('/gerencialitl');
  }
});

// Gerência
app.get("/gerencia" ,(req,res) => {
 
  Caixa.findOne({
    where: { id: 1 },
  }).then((caixa) => {

    res.render('src/admin/index.ejs',{
      caixa: caixa.valor_caixa
    });
  });
  
});

// Rota de Contribuintes
app.get("/contribuintes" ,(req,res) => {
  Contribuinte.findAll({
    order: [
      ['id', 'DESC'],
  ]
  }).then((contribuintes) => {
    res.render('src/admin/contribuintes.ejs',{
      contribuintes: contribuintes,
    });
  });
});
//==================================================
app.get("/novopadrinho", (req,res) =>{
  res.render('src/admin/novopadrinho.ejs');
});

app.get("/novoconvidado", (req,res) =>{
  res.render('src/admin/novoconvidado.ejs');
});

//==================================================
// CADASTRAR PRESENTE [ UPLOAD E CAMINHO DA IMAGEM ]

app.get("/cadastrarpresente" ,(req,res) => {
  res.render('src/admin/cadastrarpresente.ejs');
});

// Middleware nessa rota com o Multer para fazer Upload
app.post("/processarPresente", upload.single('imagem_product') , (req,res) =>{
  //------------------------------------------
  var nome_product    = req.body.nome_product;
  var valor_produto   = req.body.valor_produto; 
 
  var status_produto  = req.body.status_produto;
  var descricao       = req.body.descricao;
  
  var caminho_image       = './images/listadepresentes/';
  var imagem_producto     = req.file.originalname;


  // Add Table====================================
  Presente.create({
    nome_produto: nome_product,
    valor_produto: valor_produto,
    status_produto: status_produto,
    falta: valor_produto,
    descricao: descricao,
    imagem: caminho_image+imagem_producto
  }).then(() => {
    res.redirect('/verpresente');
  });
  //===============================================

});
//==================================================

app.get("/verpresente", (req,res) => {
  Presente.findAll().then((presentes) => {
    res.render('src/admin/verpresente.ejs' ,{ presentes: presentes });
  });
});

//==================================================


// Lista de Presentes-----------------------
app.get("/listadepresentes" ,(req,res) => {
  var tel = req.session.geral.tel;

  Presente.findAll({
    where: { status_produto: "Em pagamento" }
  }).then((presentes) => {
    res.render('src/lista/index.ejs', { presentes: presentes , tel: tel});
  });

});
//-------------------------------------------



app.listen(PORT, (error) => {
    if (error) {
      console.log("App não foi iniciado corretamente!");
    } else {
      console.log(`Aplicação rodando na porta ${PORT}`);
    }
});