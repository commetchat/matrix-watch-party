
# Watch Party
<p align="left">
    <a href="https://commet.chat/donate"><img alt="Donate" src="https://img.shields.io/badge/donate-534cdd?style=for-the-badge"></a>
    <a href="https://matrix.to/#/#commet:matrix.org"><img alt="Matrix" src="https://img.shields.io/matrix/commet%3Amatrix.org?logo=matrix&style=for-the-badge&color=534cdd"></a>
    <a href="https://fosstodon.org/@commetchat"><img alt="Mastodon" src="https://img.shields.io/mastodon/follow/109894490854601533?domain=https%3A%2F%2Ffosstodon.org&style=for-the-badge&logo=mastodon&color=534cdd&logoColor=white"></a>
    <a href="https://bsky.app/profile/commet.chat"><img alt="Bluesky" src="https://img.shields.io/badge/follow-@commet.chat-whitesmoke?style=for-the-badge&logo=bluesky&logoColor=white&color=534cdd"></a>
</p>


### Watch videos together
Watch Party is a Widget for Matrix clients which allows you to watch videos in sync with your friends.

## Development
Watch Party makes use of the Matrix RTC sdk from Element Call, this needs to be built from source and included in the project directory. This can be done using the `build-matrixrtc.sh` script included in the root of this repo.

After building Matrix RTC, you can run a dev instance of Watch Party:
```
npm i
npm run dev
```