---
title: "How to set and change your Matrix password if you signed up with a third party like Google, Github etc"
urlPath: "how-to-set-matrix-password"
date: "2024-04-02"
categories: 
  - "technical writing"
tags: 
  - "how-to"
  - "matrix"
---

Most people who sign up for [Matrix](https://matrix.org) start off on Element and  the Matrix Foundation's homeserver `matrix.org`. When you sign up on Element you have the option to use third party authentication such as Github, Gitlab, Google, or Facebook.

A lot of people opt to use this method to sign up for services because it offers relatively lower friction - you don't have to remember yet another password.

However the problem comes when you want to use another Matrix [client](https://matrix.org/ecosystem/clients) that is not Element and you are asked for a password.

You will also see that under your Element settings you will have the option to set a new password, but with a catch - you cannot do it without first entering your current password (which you again won't have) [^1]

Here's how you resolve it:

1. Sign into your Matrix homeserver using Element and navigate to `Settings`.
2. Under `General` go to `Email addresses` and add your email to the input field, then click the `Add` button. You will then be asked to verify the email. 
3. Verify the email with your email provider by clicking the verification link. 
4. Sign out of Element and then go to Login again but now specify your email and  reset the password (You will get the option to specify the new password right there, but it will only be effected once you verify with your email)
5. In your email verify the verification link 

Now you can use your new password to use another Matrix client such as [SchildiChat](https://schildi.chat/) or [FluffyChat](https://fluffychat.im/)!

---

[^1]: This is a bug in [Synapse](https://github.com/element-hq/synapse/issues/11944)