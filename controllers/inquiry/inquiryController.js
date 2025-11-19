import Inquiry from "../../models/inquirySchema.js";
import InquiryReply from "../../models/inquiryReplySchema.js"
import User from "../../models/userSchema.js";

// 문의글 등록
export const postInquiry = async (req, res) => {
  console.log("문의글 저장 요청😱");
  // console.log(req.users.user_id)
 const { inquiry_id, type, title, content, file } = req.body;
 const user_id = req.user?.user_id;
 if(!user_id) {
  return res.status(400).json({message : '인증 필요'})
 }
 const user = await User.findOne({ user_id : user_id })
 const user_name = user.name
 const inquiry = {
  inquiry_id : inquiry_id,
  user_id : user_id,
  user_name : user_name,
  type : type,
  title : title,
  content : content,
  file : file
 }

 try {
    await Inquiry.create(inquiry)
  } catch (error) {
    console.error(`inquiryController postInquiry ${error}`)
    res.status(500).json({
      message : "데이터를 추가하는 중 오류 발생"
    })
  }

  res.status(200).json({
    message: "문의글 등록이 완료되었습니다.😊"
  })
}

// 문의글 전체 조회
export const getInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.find().sort({created_at: -1})
    res.status(200).json({
      message: '문의글 조회',
      data : inquiry,
    });
    const user = await User.findOne({ user_id: user_id }, {
            password: 0, // 비밀번호는 제외
            __v: 0
        }).lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "회원 정보를 찾을 수 없습니다."
            });
        }

        res.status(200).json({
            success: true,
            message: "회원 정보를 성공적으로 조회했습니다.",
            user: user
        });
  } catch(error) {
    console.error(`inquiryController getinquirys ${error}`)
    res.status(500).json({message : "문의글 조회 오류"})
  }
}

// 문의글 하나만 조회
export const getInquiryById = async (req, res) => {
    try {
        const inquiry_id = req.params.id;

        const user = await Inquiry.findOne({ inquiry_id : inquiry_id }, {
        }).lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "문의글 정보를 찾을 수 없습니다."
            });
        }

        res.status(200).json({
            success: true,
            message: "문의글 정보를 성공적으로 조회했습니다.",
            user: user
        });

    } catch (error) {
        console.error("문의글 조회 오류:", error);
        res.status(500).json({
            success: false,
            message: "회문의글 조회 중 오류가 발생했습니다."
        });
    }
};

// 문의 답글 등록
export const postInquiryReply = async (req, res) => {
 console.log("문의글 답글 저장 요청😱");
 const { reply_id, inquiry_id, reply_content } = req.body;
 const user_id = req.user?.user_id;
 const user = await User.findOne({ user_id : user_id });
 const user_name = user.name;

 if (!user_id) {
   return res.status(401).json({message : "인증필요"})
 }

 const inquiryReply = {
  reply_id : reply_id,
  inquiry_id : inquiry_id,
  user_id : user_id,
  user_name : user_name,
  reply_content : reply_content
 }

 try {
    await InquiryReply.create(inquiryReply)
    await Inquiry.findOneAndUpdate(
      {inquiry_id},
      {$set : {reply_yn : true}},
      {new : true}
    )
  } catch (error) {
    console.error(`inquiryController postInquiry ${error}`)
    res.status(500).json({
      message : "데이터를 추가하는 중 오류 발생"
    })
  }

  res.status(200).json({
    message: "댓글 등록이 완료되었습니다.😊"
  })
}

// 문의 답글 조회
export const getInquiryReply = async (req, res) => {
  try {
    const inquiry_id = req.params.id;
    const inquiryReply = await InquiryReply.find({inquiry_id : inquiry_id}).sort({created_at: 1})
    res.status(200).json({
      message: '문의글 답글 조회',
      data : inquiryReply,
    });
  } catch(error) {
    console.error(`inquiryController getinquirys ${error}`)
    res.status(500).json({message : "문의글 답글 조회 오류"})
  }
}