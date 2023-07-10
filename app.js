const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const lodash=require("lodash");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.listen(3000, function(){
    console.log("Server started on port 3000");
});

//Setting up the mongoose
const mongoose=require("mongoose");
let db = "";
async function main(){
    try{
        db = mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser: true});
        console.log("successfully connected to the database");
    } catch(err) {
        console.log(err);
    }
}
main();
const article_schema = new mongoose.Schema({
    title: String,
    content: String
});
const Article=mongoose.model("articles",article_schema);

/*
//Getting all the articles
app.get("/articles",function(req,res){
    Article.find().then(function(results){
        res.send(results);
    });
});

//Posting a new article
app.post("/articles",function(req,res){
    const new_article=new Article({
        title: req.body.title,
        content: req.body.content
    });
    new_article.save();
    res.send("Succesfully Posted!");
});


//Deleting all the articles
app.delete("/articles",function(req,res){
    Article.deleteMany().then(function(){
        res.send("Successfully deleted all the articles");
    });
});
*/

//Using Chaining Methods
app.route("/articles")
.get(function(req,res){
    Article.find().then(function(results){
        res.send(results);
    });
})
.post(function(req,res){
    const new_article=new Article({
        title: req.body.title,
        content: req.body.content
    });
    new_article.save();
    res.send("Succesfully Posted!");
})
.delete(function(req,res){
    Article.deleteMany().then(function(){
        res.send("Successfully deleted all the articles");
    });
});



//For fetching the specific articles.
// Model.findOne no longer accepts a callback
app.route("/articles/:articleTitle")
.get(function(req,res){
    var val = req.params.articleTitle;
    Article.findOne({title: val})
    .then((foundArticle)=>{
        if(foundArticle){
            res.send(foundArticle);
        }
        else{
            res.send("No articles matched");
        }
    })
    .catch((err)=>{
        console.log(err);
    });
})
.put(function(req, res){
    const searchedTitle = req.params.articleTitle;
    Article.replaceOne(
        {title: searchedTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite:true})
        .then((replacedArticle) => {
            if(replacedArticle.matchedCount!=0){
                res.send("Successfully Replaced The Article");
            }
            else{
                res.send("No Match Found");
            }
        })
        .catch((err) => {
            console.log(err);
        });
})
.patch(function(req, res){
    const searchedTitle = req.params.articleTitle;
    Article.updateOne(
        {title: searchedTitle}, 
        {$set: req.body})
        .then((updatedArticle)=>{
            if(updatedArticle.matchedCount!=0){
                res.send("Successfully Updated The Documents.");
            }
            else{
                res.send("No Match Found");
            }
        })
        .catch((err) => {
            console.log(err);
        });
})
.delete(function(req,res){
    const searchedTitle = req.params.articleTitle;
    Article.deleteOne(
        {title: searchedTitle})
        .then((deletedItem)=>{
            if(deletedItem.deletedCount!=0){
                res.send("Deleted the Document Suceessfully");
            }
            else{
                res.send("No articles found with this title");
            }
        })
        .catch((err) => {
            console.log(err);
    });
});
