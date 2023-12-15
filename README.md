# schoolTalks_FE
오류명: 파일 업로드 오류

오류내용: 서버 응답에 따르면 파일 업로드 시 다음과 같은 오류 발생.

```
{
  "image": [
    "제출된 데이터는 파일이 아닙니다. 제출된 서식의 인코딩 형식을 확인하세요."
  ],
  "attachment": [
    "제출된 데이터는 파일이 아닙니다. 제출된 서식의 인코딩 형식을 확인하세요."
  ]
}
```
해결법:

HTML 폼에 enctype="multipart/form-data" 추가.
JavaScript에서 FormData 객체를 사용하여 파일 업로드 데이터를 적절히 처리.
서버 측 Django 및 Django REST framework 설정 및 뷰 함수를 확인하여 파일 업로드 처리.
