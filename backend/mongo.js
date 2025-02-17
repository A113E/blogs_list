const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give a password argument')
  process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@fullstack.mwzkn.mongodb.net/BlogsList?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url:  String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: 'Test Blog',
  author: 'Alberto',
  url: 'test.com',
  likes: 0
})

Blog.find({}).then(result => {
  result.forEach(blog => {
    console.log(blog)
  })
  mongoose.connection.close()
})


/*blog.save().then(result =>{
  console.log('blog saved');
    mongoose.connection.close()
})*/