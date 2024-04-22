<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Research Blog</title>
  <style>
  </style>
</head>
<body>

  <h1>Research Blog</h1>

  <form id="blogPostForm">
    <!-- Other form fields -->
    
    <!-- Optional Email Address Field -->
    <label for="email">Email Address (optional): </label>
    <input type="text" id="email" name="email" placeholder="Enter your email">

    <button type="button" onclick="publishBlogPost()">Publish Post</button>
  </form>

  <script>
    function publishBlogPost() {
   
      const emailInput = document.getElementById('email');
      const email = emailInput.value;

      const publishedPost = document.createElement('div');
      publishedPost.innerHTML = `
        <h2>Published Blog Post</h2>
        <!-- Display other post details -->
        <p>Email Address: ${email}</p>
      `;
      document.body.appendChild(publishedPost);

    }
  </script>

</body>
</html>
