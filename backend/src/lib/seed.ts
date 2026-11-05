
import mongoose from 'mongoose';
import { convert } from 'html-to-text';
import { User } from '../schemas/user.model.js';
import { Site } from '../schemas/site.model.js';

export function extractText(html: string) {
  return convert(html, {
    wordwrap: false,
    selectors: [
      { selector: 'script', format: 'skip' },
      { selector: 'style', format: 'skip' },   
      { selector: 'title', format: 'skip' },  
      { selector: 'a', options: { ignoreHref: true } }, 
    ],
  })
    .replace(/\s+/g, ' ') 
    .trim();
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smallweb';


const USERS = [
  'Ahsan Gulzar',
  'Zoha Naeem',
  'Hamza Tariq',
  'Ayesha Siddiqui',
  'Bilal Ahmed',
  'Mehwish Ali',
  'Usman Khalid',
  'Fatima Raza',
];


const PAGES = [
  {
    address: 'littlelamp.zz',
    title: 'Little Lamp',
    authorName: 'Ahsan Gulzar',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Little Lamp</title>
<style>
  body{margin:0; min-height:100vh; background:#fbf6ec; color:#2c2622; font-family:Georgia, "Iowan Old Style", serif; display:flex; justify-content:center; padding:5rem 1.5rem;}
  article{max-width:36rem; width:100%;}
  .address{font-family:ui-monospace, "SF Mono", Menlo, monospace; font-size:.8rem; letter-spacing:.16em; color:#8a7f70; margin-bottom:1rem;}
  h1{font-size:4.4rem; font-weight:700; margin:0 0 2rem; line-height:1; letter-spacing:-.03em; color:#2c2622;}
  p{line-height:1.85; margin:0 0 1.1rem; font-size:1.05rem;}
  .divider{width:3rem; height:1px; background:#8a7f70; opacity:.5; margin:2.5rem 0; border:0;}
  .links{font-size:.9rem; margin-top:2rem;}
  a{color:#8a7f70;}
  footer{margin-top:2.5rem; font-size:.85rem; color:#8a7f70;}
  footer strong{color:#2c2622; font-weight:600;}
</style>
</head>
<body>
  <article>
    <div class="address">littlelamp.zz</div>
    <h1>Little Lamp</h1>
    <p>There is a lamp on my desk that I have not turned off in three years. It is not bright. It is the kind of light you notice only when it is gone, the way you notice a friend's breathing only when they leave the room.</p>
    <p>I keep it on because the room feels different without it &mdash; too honest, maybe. A little too much like a place where things end.</p>
    <p>This page is small on purpose. Not every thing needs to be a cathedral. Some things are just a lamp, a desk, and a person still awake.</p>
    <hr class="divider" />
    <p class="links">Elsewhere: <a href="palelight.zz">palelight.zz</a> &middot; <a href="smallfire.zz">smallfire.zz</a> &middot; <a href="oldlantern.zz">oldlantern.zz</a></p>
    <footer>written by <strong>june</strong> &middot; published at <strong>littlelamp.zz</strong></footer>
  </article>
</body>
</html>`,
  },

  {
    address: 'tidepool.zz',
    title: 'Tidepool',
    authorName: 'Zoha Naeem',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Tidepool</title>
<style>
  body{margin:0; min-height:100vh; background:#e7eef2; color:#1e3a4c; font-family:"Helvetica Neue", Arial, sans-serif; display:flex; justify-content:center; padding:5rem 1.5rem;}
  article{max-width:36rem; width:100%;}
  .address{font-family:monospace; font-size:.78rem; letter-spacing:.18em; color:#5a8aa5; text-transform:lowercase; margin-bottom:1rem;}
  h1{font-size:4.2rem; font-weight:700; margin:0 0 2rem; line-height:1; letter-spacing:-.03em; color:#1e3a4c;}
  p{line-height:1.85; margin:0 0 1.1rem; font-size:1.02rem;}
  .links{font-size:.9rem; margin-top:2rem;}
  a{color:#5a8aa5;}
  footer{margin-top:2.5rem; font-size:.8rem; color:#6b8fa3;}
</style>
</head>
<body>
  <article>
    <div class="address">tidepool.zz</div>
    <h1>Tidepool</h1>
    <p>Small worlds gather in the low water and stay there until the sea remembers to take them back. I visit at dawn, before the remembering.</p>
    <p>Starfish, a broken shell, one very confident crab. The pool is not sad about being temporary. It is busy being a pool.</p>
    <p class="links">Elsewhere: <a href="reefnotes.zz">reefnotes.zz</a> &middot; <a href="saltbread.zz">saltbread.zz</a></p>
    <footer>nora &middot; tidepool.zz</footer>
  </article>
</body>
</html>`,
  },

  {
    address: 'reefnotes.zz',
    title: 'Reef Notes',
    authorName: 'Hamza Tariq',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Reef Notes</title>
<style>
  body{margin:0; min-height:100vh; background:#fbf3ee; color:#4a2b26; font-family:Georgia, serif; display:flex; justify-content:center; padding:5rem 1.5rem;}
  article{max-width:38rem; width:100%; border-left:4px solid #c97b5a; padding-left:2rem;}
  .address{font-family:monospace; font-size:.8rem; letter-spacing:.16em; color:#c97b5a; margin-bottom:1rem;}
  h1{font-size:4.4rem; font-weight:700; margin:0 0 2rem; line-height:1; letter-spacing:-.03em; color:#4a2b26;}
  p{line-height:1.9; margin:0 0 1.1rem; font-size:1.05rem;}
  .links{font-size:.9rem; margin-top:2rem;}
  a{color:#c97b5a;}
  footer{margin-top:2.5rem; font-size:.82rem; color:#9c6b55;}
</style>
</head>
<body>
  <article>
    <div class="address">reefnotes.zz</div>
    <h1>Reef Notes</h1>
    <p>Day fourteen. The coral is slow, the fish are fast, and the water is the only thing here that does not gossip.</p>
    <p>I have stopped counting things. Counting is a city habit. Out here you just notice, and then you let the noticing go.</p>
    <p class="links">Elsewhere: <a href="tidepool.zz">tidepool.zz</a> &middot; <a href="slowriver.zz">slowriver.zz</a> &middot; <a href="deepchart.zz">deepchart.zz</a></p>
    <footer>mira &middot; reefnotes.zz</footer>
  </article>
</body>
</html>`,
  },

  {
    address: 'saltbread.zz',
    title: 'Salt Bread',
    authorName: 'Ayesha Siddiqui',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Salt Bread</title>
<style>
  body{margin:0; min-height:100vh; background:#f6efe4; color:#3a2e1f; font-family:"Trebuchet MS", sans-serif; display:flex; justify-content:center; padding:5rem 1.5rem;}
  article{max-width:36rem; width:100%; background:#fffaf0; padding:3rem 2.5rem; border-radius:10px; box-shadow:0 2px 0 #e6dcc8, 0 22px 50px -22px #b09a72;}
  .address{font-family:monospace; font-size:.8rem; letter-spacing:.16em; color:#b08d57; margin-bottom:1rem;}
  h1{font-size:4.4rem; font-weight:700; margin:0 0 2rem; line-height:1; letter-spacing:-.03em; color:#3a2e1f;}
  p{line-height:1.9; margin:0 0 1.1rem; font-size:1.03rem;}
  .links{font-size:.9rem; margin-top:2rem;}
  a{color:#b08d57;}
  footer{margin-top:2.5rem; font-size:.8rem; color:#9c8864; border-top:1px dashed #e0d2b8; padding-top:1rem;}
</style>
</head>
<body>
  <article>
    <div class="address">saltbread.zz</div>
    <h1>Salt Bread</h1>
    <p>Flour, water, salt, time. Four things that become one thing, and the one thing becomes the reason people come home.</p>
    <p>I bake on Tuesdays. Not for anyone. Just so the kitchen smells like it has a purpose.</p>
    <p class="links">Elsewhere: <a href="tidepool.zz">tidepool.zz</a> &middot; <a href="smallfire.zz">smallfire.zz</a></p>
    <footer>ines &middot; saltbread.zz</footer>
  </article>
</body>
</html>`,
  },

  {
    address: 'palelight.zz',
    title: 'Pale Light',
    authorName: 'Bilal Ahmed',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Pale Light</title>
<style>
  body{margin:0; min-height:100vh; background:#f4f4f2; color:#2b2b2b; font-family:"Segoe UI", Tahoma, sans-serif; display:flex; justify-content:center; padding:6rem 1.5rem;}
  article{max-width:34rem; width:100%;}
  .address{font-family:monospace; font-size:.8rem; letter-spacing:.16em; color:#8a8a8a; margin-bottom:1.2rem;}
  h1{font-size:4.4rem; font-weight:700; margin:0 0 2rem; line-height:1; letter-spacing:-.03em; color:#1a1a1a;}
  p{line-height:2; margin:0 0 1.2rem; font-size:1.02rem; color:#3a3a3a;}
  .links{font-size:.9rem; margin-top:2rem;}
  a{color:#555;}
  footer{margin-top:3rem; font-size:.8rem; color:#8a8a8a;}
</style>
</head>
<body>
  <article>
    <div class="address">palelight.zz</div>
    <h1>Pale Light</h1>
    <p>There is a kind of morning that arrives without announcing itself, the sky still grey and undecided, and everything in the room looks like it is remembering something.</p>
    <p>I like this light best. It does not demand anything. It just waits with you.</p>
    <p class="links">Elsewhere: <a href="littlelamp.zz">littlelamp.zz</a> &middot; <a href="firstsnow.zz">firstsnow.zz</a> &middot; <a href="halfmoon.zz">halfmoon.zz</a></p>
    <footer>june &middot; palelight.zz</footer>
  </article>
</body>
</html>`,
  },

  {
    address: 'quietbell.zz',
    title: 'Quiet Bell',
    authorName: 'Mehwish Ali',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Quiet Bell</title>
<style>
  body{margin:0; min-height:100vh; background:#f2ede3; color:#3a3020; font-family:Garamond, "Times New Roman", serif; display:flex; justify-content:center; padding:5rem 1.5rem;}
  article{max-width:36rem; width:100%; text-align:center;}
  .address{font-family:monospace; font-size:.8rem; letter-spacing:.2em; color:#a08a5b; margin-bottom:1.4rem;}
  h1{font-size:4.6rem; font-weight:700; margin:0 0 2rem; line-height:1; letter-spacing:-.03em; color:#2a2216;}
  h1::after{content:""; display:block; width:48px; height:3px; background:#c9a24b; margin:1.4rem auto 0;}
  p{line-height:1.9; margin:0 0 1.1rem; font-size:1.05rem; text-align:left;}
  .links{font-size:.9rem; margin-top:2rem;}
  a{color:#a08a5b;}
  footer{margin-top:2.5rem; font-size:.82rem; color:#8a7550;}
</style>
</head>
<body>
  <article>
    <div class="address">quietbell.zz</div>
    <h1>Quiet Bell</h1>
    <p>There is a bell in the temple that only rings when the wind is honest. Most days it says nothing. That is not a failure.</p>
    <p>I have learned to sit near it and wait. Not for the sound, but for the silence that makes the sound possible.</p>
    <p class="links">Elsewhere: <a href="slowriver.zz">slowriver.zz</a> &middot; <a href="halfmoon.zz">halfmoon.zz</a> &middot; <a href="lostbridge.zz">lostbridge.zz</a></p>
    <footer>sameer &middot; quietbell.zz</footer>
  </article>
</body>
</html>`,
  },

  {
    address: 'slowriver.zz',
    title: 'Slow River',
    authorName: 'Usman Khalid',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Slow River</title>
<style>
  body{margin:0; min-height:100vh; background:#eaf1e8; color:#25321f; font-family:Verdana, Geneva, sans-serif; display:flex; justify-content:center; padding:5rem 1.5rem;}
  article{max-width:36rem; width:100%;}
  .address{font-family:monospace; font-size:.8rem; letter-spacing:.16em; color:#6b8a5a; margin-bottom:1rem;}
  h1{font-size:4.4rem; font-weight:700; margin:0 0 2rem; line-height:1; letter-spacing:-.03em; color:#25321f;}
  p{line-height:1.95; margin:0 0 1.1rem; font-size:1rem;}
  .links{font-size:.9rem; margin-top:2rem;}
  a{color:#6b8a5a;}
  footer{margin-top:2.5rem; font-size:.8rem; color:#7a9a6b;}
</style>
</head>
<body>
  <article>
    <div class="address">slowriver.zz</div>
    <h1>Slow River</h1>
    <p>The river does not know where it is going and does not care. It only knows how to keep going, which turns out to be enough.</p>
    <p>I sat on the bank for an hour. Nothing happened. It was the best hour I have had in weeks.</p>
    <p class="links">Elsewhere: <a href="reefnotes.zz">reefnotes.zz</a> &middot; <a href="drycreek.zz">drycreek.zz</a> &middot; <a href="quietbell.zz">quietbell.zz</a></p>
    <footer>tomas &middot; slowriver.zz</footer>
  </article>
</body>
</html>`,
  },

  {
    address: 'halfmoon.zz',
    title: 'Half Moon',
    authorName: 'Fatima Raza',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Half Moon</title>
<style>
  body{margin:0; min-height:100vh; background:#12151c; color:#c9d0db; font-family:"Palatino Linotype", Palatino, serif; display:flex; justify-content:center; padding:5rem 1.5rem;}
  article{max-width:36rem; width:100%;}
  .address{font-family:monospace; font-size:.8rem; letter-spacing:.18em; color:#8892a6; margin-bottom:1.2rem;}
  h1{font-size:4.6rem; font-weight:700; margin:0 0 2rem; line-height:1; letter-spacing:-.03em; color:#f0f3f7;}
  p{line-height:1.95; margin:0 0 1.1rem; font-size:1.02rem; color:#b0b8c4;}
  .links{font-size:.9rem; margin-top:2rem;}
  a{color:#8892a6;}
  footer{margin-top:2.5rem; font-size:.8rem; color:#6b7585;}
</style>
</head>
<body>
  <article>
    <div class="address">halfmoon.zz</div>
    <h1>Half Moon</h1>
    <p>The moon tonight is not trying to be full. It hangs there, half of itself, perfectly fine with the missing part.</p>
    <p>I think I am learning from it. Being partly here is still being here.</p>
    <p class="links">Elsewhere: <a href="palelight.zz">palelight.zz</a> &middot; <a href="quietbell.zz">quietbell.zz</a> &middot; <a href="firstsnow.zz">firstsnow.zz</a></p>
    <footer>ravi &middot; halfmoon.zz</footer>
  </article>
</body>
</html>`,
  },

  {
    address: 'firstsnow.zz',
    title: 'First Snow',
    authorName: 'Hamza Tariq',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>First Snow</title>
<style>
  body{margin:0; min-height:100vh; background:#eef2f6; color:#2a3440; font-family:"Avenir Next", "Helvetica Neue", sans-serif; display:flex; justify-content:center; padding:5rem 1.5rem;}
  article{max-width:36rem; width:100%;}
  .address{font-family:monospace; font-size:.8rem; letter-spacing:.16em; color:#7a8fa5; margin-bottom:1rem;}
  h1{font-size:4.6rem; font-weight:700; margin:0 0 2rem; line-height:1; letter-spacing:-.03em; color:#2a3440;}
  p{line-height:1.95; margin:0 0 1.1rem; font-size:1.02rem;}
  .links{font-size:.9rem; margin-top:2rem;}
  a{color:#7a8fa5;}
  footer{margin-top:2.5rem; font-size:.8rem; color:#7a8fa5;}
</style>
</head>
<body>
  <article>
    <div class="address">firstsnow.zz</div>
    <h1>First Snow</h1>
    <p>It came last night, quietly, while everyone was asleep. This morning the whole street looks like it has agreed to be gentle.</p>
    <p>Nothing has changed, and yet everything has. Snow is like that. It does not add, it only covers.</p>
    <p class="links">Elsewhere: <a href="halfmoon.zz">halfmoon.zz</a> &middot; <a href="smallfire.zz">smallfire.zz</a></p>
    <footer>sana &middot; firstsnow.zz</footer>
  </article>
</body>
</html>`,
  },

  {
    address: 'smallfire.zz',
    title: 'Small Fire',
    authorName: 'Ahsan Gulzar',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Small Fire</title>
<style>
  body{margin:0; min-height:100vh; background:#1f1410; color:#ecd8c4; font-family:Georgia, serif; display:flex; justify-content:center; padding:5rem 1.5rem;}
  article{max-width:36rem; width:100%;}
  .address{font-family:monospace; font-size:.8rem; letter-spacing:.18em; color:#c7794b; margin-bottom:1.2rem;}
  h1{font-size:4.6rem; font-weight:700; margin:0 0 2rem; line-height:1; letter-spacing:-.03em; color:#f7e6d2;}
  p{line-height:1.9; margin:0 0 1.1rem; font-size:1.02rem; color:#d8bfa6;}
  .links{font-size:.9rem; margin-top:2rem;}
  a{color:#c7794b;}
  footer{margin-top:2.5rem; font-size:.8rem; color:#a8805f;}
</style>
</head>
<body>
  <article>
    <div class="address">smallfire.zz</div>
    <h1>Small Fire</h1>
    <p>It is not a bonfire. It is not a hearth. It is just enough fire to boil water and to make the dark seem polite.</p>
    <p>Small fire is honest fire. It does not pretend to warm a whole house. It warms two hands, and that is its work.</p>
    <p class="links">Elsewhere: <a href="littlelamp.zz">littlelamp.zz</a> &middot; <a href="saltbread.zz">saltbread.zz</a> &middot; <a href="drycreek.zz">drycreek.zz</a></p>
    <footer>sameer &middot; smallfire.zz</footer>
  </article>
</body>
</html>`,
  },

  {
    address: 'drycreek.zz',
    title: 'Dry Creek',
    authorName: 'Zoha Naeem',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Dry Creek</title>
<style>
  body{margin:0; min-height:100vh; background:#f0e9dd; color:#3a3226; font-family:"Courier New", monospace; display:flex; justify-content:center; padding:5rem 1.5rem;}
  article{max-width:36rem; width:100%;}
  .address{font-size:.8rem; letter-spacing:.2em; color:#a08a63; margin-bottom:1.2rem;}
  h1{font-size:4.4rem; font-weight:700; margin:0 0 2rem; line-height:1; letter-spacing:-.03em; color:#2a2419;}
  p{line-height:1.95; margin:0 0 1.1rem; font-size:.98rem;}
  .links{font-size:.88rem; margin-top:2rem;}
  a{color:#a08a63;}
  footer{margin-top:2.5rem; font-size:.78rem; color:#a08a63;}
</style>
</head>
<body>
  <article>
    <div class="address">drycreek.zz</div>
    <h1>Dry Creek</h1>
    <p>The creek has been dry for two years now, but the stones still lie where the water left them. They did not move. They are not waiting. They just are.</p>
    <p>There is something to learn from a dry creek. It remembers being water without insisting on it.</p>
    <p class="links">Elsewhere: <a href="slowriver.zz">slowriver.zz</a> &middot; <a href="tidepool.zz">tidepool.zz</a> &middot; <a href="vanishedwell.zz">vanishedwell.zz</a></p>
    <footer>tomas &middot; drycreek.zz</footer>
  </article>
</body>
</html>`,
  },
];


async function run() {
  console.log('→ connecting…');
  await mongoose.connect(MONGO_URI);
  console.log('✓ connected');

  await User.bulkWrite(
    USERS.map((name) => ({
      updateOne: {
        filter: { name },
        update: { $set: { name } },
        upsert: true,
      },
    }))
  );


  const users = await User.find({ name: { $in: USERS } });
  const userIdByName = Object.fromEntries(users.map((u) => [u.name, u._id]));
  console.log(`✓ users: ${users.length}`);


  await Site.bulkWrite(
    PAGES.map((p) => ({
      updateOne: {
        filter: { address: p.address },
        update: {
          $set: {
            title: p.title,
            html: p.html,
            text: extractText(p.html),
            author: userIdByName[p.authorName],
          },
        },
        upsert: true,
      },
    }))
  );
  console.log(`✓ sites: ${PAGES.length}`);

  await Promise.all([User.syncIndexes(), Site.syncIndexes()]);
  console.log('✓ indexes');

  await mongoose.disconnect();
  console.log('✓ done');
}

run().catch((err) => {
  console.error('✗ seed failed:', err);
  process.exit(1);
});