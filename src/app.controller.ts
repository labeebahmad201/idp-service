import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class AppController {
  /**
   * Dev-friendly landing page for password reset emails.
   * The API still confirms via POST /v1/password-reset/confirm.
   */
  @Get('reset-password')
  @Header('Content-Type', 'text/html; charset=utf-8')
  resetPasswordPage(
    @Query('token') token: string | undefined,
    @Res() res: Response,
  ): void {
    const safeToken = token ?? '';
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reset password</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 28rem; margin: 2rem auto; padding: 0 1rem; }
    label { display: block; margin-top: 1rem; font-weight: 600; }
    input { width: 100%; padding: 0.5rem; margin-top: 0.25rem; box-sizing: border-box; }
    button { margin-top: 1.25rem; padding: 0.6rem 1rem; cursor: pointer; }
    #msg { margin-top: 1rem; white-space: pre-wrap; }
    .err { color: #b00020; }
    .ok { color: #0a6; }
  </style>
</head>
<body>
  <h1>Reset password</h1>
  <p>Enter a new password, then confirm. Token comes from the email link.</p>
  <label for="token">Token</label>
  <input id="token" type="text" readonly value="${escapeHtml(safeToken)}" />
  <label for="pw">New password</label>
  <input id="pw" type="password" autocomplete="new-password" minlength="8" />
  <button type="button" id="go">Set new password</button>
  <div id="msg"></div>
  <script>
    (function () {
      var params = new URLSearchParams(window.location.search);
      var t = params.get('token');
      if (t) document.getElementById('token').value = t;
      document.getElementById('go').onclick = function () {
        var token = document.getElementById('token').value.trim();
        var newPassword = document.getElementById('pw').value;
        var msg = document.getElementById('msg');
        msg.textContent = '';
        msg.className = '';
        if (!token) { msg.className = 'err'; msg.textContent = 'Missing token.'; return; }
        if (!newPassword || newPassword.length < 8) { msg.className = 'err'; msg.textContent = 'Password must be at least 8 characters.'; return; }
        fetch('/v1/password-reset/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token, newPassword: newPassword })
        }).then(function (r) {
          if (r.status === 204) { msg.className = 'ok'; msg.textContent = 'Password updated. You can close this page.'; return; }
          return r.json().then(function (j) { throw new Error(j.message || r.statusText); });
        }).catch(function (e) { msg.className = 'err'; msg.textContent = String(e.message || e); });
      };
    })();
  </script>
</body>
</html>`;
    res.status(200).send(html);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
