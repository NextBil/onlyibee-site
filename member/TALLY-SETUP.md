# Connect the member page to Tally (free, ~10 min)

The member page (`member/index.html`) already builds every member's pass, rank, power
level and referral link. The only missing piece is **where the register form sends the
info** — that's Tally (free). You own the account and the data.

## 1. Make the form
1. Go to **tally.so** → sign up free.
2. **Create new form** → name it `ONLY IBEE — FREQUENCY PASS`.
3. Add these question fields:
   - **Pseudo / name** (short text) — required
   - **WhatsApp / phone** (phone) — required
   - **Instagram or TikTok @** (short text)
   - **City** (short text)
   - (optional) **What pulls you in?** (multiple choice: the music / the fits / the games / the world)

## 2. Add the 3 HIDDEN fields (this is the important part)
These capture the card + referral automatically. In the form builder:
- Click **⚙ / "Add hidden field"** and create three, named **exactly**:
  - `pass`
  - `ref`
  - `rank`
> The member page passes these in the URL, so Tally fills them in silently. That's how
> you'll see *which card* registered and *who referred them*.

## 3. Get the form id
- Hit **Publish**. Your form URL looks like `https://tally.so/r/wa2Bq9`.
- The id is the last part: **`wa2Bq9`**.

## 4. Paste the id into the site
- Open `member/index.html`, find this line near the top of the script:
  ```js
  var TALLY_FORM = "";   /* e.g. "wa2Bq9" */
  ```
- Put your id between the quotes: `var TALLY_FORM = "wa2Bq9";`
- Upload `member/index.html`. The register panel goes live instantly.
- *(Or just send me the id and I'll drop it in.)*

## 5. Where the data lands
- **Tally → Responses tab** = your list (name, phone, @, city + pass/ref/rank).
- Free: **Tally → Integrations → Google Sheets** so every signup auto-appends to a sheet.
- To see referrals: sort the sheet by the `ref` column — you'll see who recruited whom.

## Notes
- No-card visitors (people who found the link without a garment) still become members with a
  guest `FREQ-xxxxx` pass, so the same form works for "sold out → next drop" capture.
- This is Phase 1 (manual). Automatic referral counting + rewards = later, with a free
  backend (Supabase). The page is already built to grow into that.
