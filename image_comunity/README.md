# Beenstgrm (미니 프로젝트)


> ### 사진과 글을 공유하고 댓글과 좋아요 기능이 있는 미니 SNS
>
> <br>

## Team

- **임다빈** : 개인 프로젝트

## Environment

- **React.js**
- **JavaScript**
- **Firebase**


## Description

- 모든 페이지는 반응형, 모바일, 태블릿, 웹에서 화면이 깨지지 않도록 구현하였다.


### 1. 메인 페이지

- 로그인 전에는 헤더에는 헬로, 로그인, 회원가입

- 로그인 후에는 닉네임 + 헬로~ ,알림버튼, 로그아웃으로 바뀌며 게시물마다 수정,삭제버튼이 생긴다. <br>
오른쪽 하단에 글 작성을 할 수 있는 플로팅 버튼이 생긴다. ()
- 이미지 모아보기
- 상단 Beenstrgm을 누르면 메인페이지로 돌아옴
- 메인페이지에서도 좋아요 가능
- 댓글 아이콘을 누르거나 사진,텍스트를 누르면 상세페이지로 이동
- 로그인 없이 좋아요 불가능

 <img src="https://user-images.githubusercontent.com/77574867/113289415-2515e200-932b-11eb-937c-c24bf6951225.png" width="300" height="400">
 <img src="https://user-images.githubusercontent.com/77574867/113289421-28a96900-932b-11eb-8a05-c8950aebbfd7.png" width="300" height="400">
 <img src="https://user-images.githubusercontent.com/77574867/113296960-0caac500-9335-11eb-9862-80b912258822.png" width="300" height="400">


### 2. 로그인 페이지, 회원가입 페이지

- 회원가입 시에는 정규표현식을 사용하여 이메일 형식, 비밀번호 형식 체크, 이메일 중복확인은 firebase의 에러메세지 활용

- 로그인 페이지에서 아이디나 비밀번호 창이 비어있으면 로그인하기 버튼 비활성화
- 회원가입이나 로그인 하면 쿠키를 생성하여 세션 스토리지에 보관하고 user 리덕스에 유저정보 업데이트 메인 페이지로 이동
- 메인페이지 에서는 세션 스토리지의 쿠키와 유저정보를 확인하여 로그인 상태 판단
- 로그아웃 시에는 세션스토리지의 쿠키 만료기간을 앞당겨 로그아웃한다.

 <img src="https://user-images.githubusercontent.com/77574867/113289420-2810d280-932b-11eb-80d9-327843a70d4d.png" width="300" height="400">
 <img src="https://user-images.githubusercontent.com/77574867/113289431-2b0bc300-932b-11eb-95d9-90a158081490.png" width="300" height="400">



### 3. 상세 페이지

- 상세페이지에서는 댓글 작성, 삭제를 할 수 있다.
- 내가 작성한 글일때만 삭제버튼이 생긴다.
- 새로운 댓글을 달면 알림표시 


<img src="https://user-images.githubusercontent.com/77574867/113297208-4d0a4300-9335-11eb-8d33-8fb091919365.png" width="300" height="400">
<img src="https://user-images.githubusercontent.com/77574867/113297475-9d81a080-9335-11eb-834b-017787ff524e.png" width="300" height="400">
<img src="https://user-images.githubusercontent.com/77574867/113297761-fe10dd80-9335-11eb-825a-1241d0d3269e.png" width="300" height="400">

### 4. 알림 페이지

- 처음 회원가입을 하면 알림표시가 생기며 알림페이지에 가입을 축하합니다 문구가 나온다.
- 내가 쓴 게시물에 댓글이 달리면 알림표시가 생긴다.
- 알림 페이지를 확인하면 알림표시가 꺼진다.

<img src="https://user-images.githubusercontent.com/77574867/113289419-27783c00-932b-11eb-8d77-c132fa84fb5e.png" width="300" height="400">


### 5. 게시물 작성 및 수정 페이지

- 플로팅 버튼을 이용했을 경우 게시물 작성페이지, 수정 버튼을 이용할 경우 수정 페이지가 나온다.
- 수정페이지에서는 기존의 사진과 내용이 이미 담겨져 있다.
- 작성 페이지에서만 레이아웃을 선택 할 수 있다.
- 이미지,내용이 둘 다 있을 경우에만 버튼 활성화, 작성페이지의 경우 레이아웃까지 선택해야 한다.
- 선택한 레이아웃대로 게시물이 작성된다.

<img src="https://user-images.githubusercontent.com/77574867/113289426-29da9600-932b-11eb-8da7-0ee3a6a1e9dc.png" width="300" height="400">
<img src="https://user-images.githubusercontent.com/77574867/113289425-29da9600-932b-11eb-9dfe-107761b3356c.png" width="300" height="400">


### Firebase

- Post collections : 게시물에 필요한 유저정보, img_url, 게시글 내용, 좋아요 수, 댓글 수,  작성일시, 레이아웃 정보

- Comment collections : 게시글id, 댓글을 남긴 유저정보, 댓글내용, 작성일시
- Like collections : 게시글id와 유저id를 묶어 하나의 새로운 like 데이터 생성, 현재 like상태(boolean)
- Storage : 이미지 저장 및 img_url 생성
- Realtime Database : 실시간 알림에 필요한 게시글 정보, 댓글을 남긴 유저정보, 게시글의 주인인 유저정보


### Components

- 컴포넌트 : Header, NotiBadge,  CommentList, CommentWrite, Post

- 엘리먼트(최소단위) : Button, Grid, Image, Input, Like, Spinner, Text

- 페이지 : Login, Signup, Notification, PostDetail, PostList, PostWrite

- 리덕스 : comment, image, like, post, user

- 미들웨어 : configStore

- 공유 : App, common(정규표현식), Cookie, firebase, InfinityScorll, Permit(로그인 여부 확인), Upload
