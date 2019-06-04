let axios = require('axios')
let Mock = require('mockjs')

// 创建axios实例
const service = axios.create({
  //   baseURL: process.env.BASE_API,// node环境的不同,对应不同的baseURL
  baseURL: "http://172.19.241.20:8082",
  timeout: 1000000, // 请求的超时时间
  //   设置默认请求头,使post请求发送的是formdata格式数据// axios的header默认的Content-Type好像是'application/json;charset=UTF-8',我的项目都是用json格式传输,如果需要更改的话,可以用这种方式修改
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  },
})

function mockRegister() {
  let arr = ['软件', '经济', '文学', '戏剧', '地科', '物理', '匡院'];
  for (let i = 0; i < arr.length; i++) {
    const college = arr[i];
    let student = Mock.mock({
      "studentNumber|161250001-161250009": 1,
      "username": "@cname",
      "school": '南京大学',
      "college": college,
      "password": 123123
    })
    student.major = student.college;
    service
      .post("/api/register", {
        studentNumber: student.studentNumber,
        username: student.username,
        school: student.school,
        college: student.college,
        major: student.major,
        password: student.password
      }).then(res=>console.log(res.data))
  }
}

function mockCourse() {
  let courses = ['思想道德修养', '马克思原理', '毛泽东理论和概念', '英语', '中国近代史', '军事理论','篮球','足球','羽毛球','游泳','红楼梦赏析','唐诗宋词赏析','大学物理','线性代数']
  for (let i = 0; i < courses.length; i++) {
    let course = Mock.mock({
      "id|18001-18999": 1,
      'name': courses[i],
      "teacherName": "@cname"
    })
    service
      .post("/api/createCourse", course).then(res=>console.log(res.data))
  }
}

function mockComment(){
  let comment1 = ['上课还可以,作业有点多,考试非常难','上课挺一般,作业非常多,考试很简单','上课有点差,作业比较少,考试有原题']
  service.get("/api/getCourses",{
    parmas:{
      "username":"zcl"

    }
  }).then(res=>{
    for(item of res.data){
      let comment = Mock.mock({
        "courseId":item.id,
        "commenter": "zcl",
        "answerTo": -1,
        "content|1": comment1,
        "scoreList": [Math.floor(Math.random()*10+1)*0.5,Math.floor(Math.random()*10+1)*0.5,Math.floor(Math.random()*10+1)*0.5,Math.floor(Math.random()*10+1)*0.5,Math.floor(Math.random()*10+1)*0.5],
        "time":""
      })
      console.log(comment)
      service.post("/api/comment",comment).then(res=>console.log(res))
    }
  }

  )
  
  // for(let i=0;i<100;i++){
  //   let comment = Mock.mock({
  //       "id|"
  //   })
  // }

}

mockComment()
// mockRegister()