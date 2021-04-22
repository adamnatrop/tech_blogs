const router = require('express').Router();
const { Post, User, Comments } = require('../models');
const withAuth = require('../utils/auth');
// display posts with comments
router.get('/', async (req, res) => {
  try {

    const postData = await Post.findAll({

      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Comments,
          attributes: ['comment']
        },
      ],
      
      
    });

    const posts = postData.map((post) => post.get({ plain: true }));
    console.log(posts[0].comments[0].comment);

    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
// display posts
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const posts = postData.get({ plain: true });

    res.render('post', {
      ...posts,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// use creds to access dashboard
router.get('/dashboard', withAuth, async (req, res) => {
  try {

    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {

  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

module.exports = router;
