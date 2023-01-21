import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import DataTable from "../../Components/AdminPanel/DataTable/DataTable";

import Input from "../../Components/Form/Input";
import useForm from "../../Hooks/useForm";
import { minValidator } from "../../validators/rules";
import TextEditor from "../../Components/Form/TextEditor";
import { Link } from "react-router-dom";

const AdminArticles = () => {
    const [allArticles,setAllArticles] = useState([])
    const [allCategories, setAllCategories] = useState([]);
    const [articleCategory, setArticleCategory] = useState("-1");
    const [articleCover, setArticleCover] = useState({});
    const [articleBody, setArticleBody] = useState('');


    const [formState,onChangeInputHandler] = useForm({
        description:{
            value:'',
            isValid:false
        },
        title:{
            value:'',
            isValid:false
        },
        shortName:{
            value:'',
            isValid:false
        },
    },false)

    function getAllArticles (){
        const localStorageData = JSON.parse(localStorage.getItem('user'))
        fetch(`http://localhost:4000/v1/articles`,{
            headers:{
                'Authorization' : `Bearer ${localStorageData.token}`
            }
        })
        .then(res => res.json())
        .then((results)=>{
            console.log(results)
            setAllArticles(results)
           
        } )
    }

    useEffect(()=>{
        fetch(`http://localhost:4000/v1/category`)
        .then((res) => res.json())
        .then((result) => setAllCategories(result));
     getAllArticles() },[])
    
    const deletearticle = (articleID) =>{
        swal({
            title:'آیا از حذف این مقاله اطمینان دارید؟',
            icon:'warning',
            buttons:['خیر','بله']
        }).then(value =>{
            if(value){
                const localStorageData = JSON.parse(localStorage.getItem('user'))
                fetch(`http://localhost:4000/v1/articles/${articleID}`,{
                    method:'DELETE',
                    headers:{
                        'Authorization':`Bearer ${localStorageData.token}`
                    }
                }).then(res=> {
            if (res.ok){
                swal({
                    title:"مقاله با موفقیت حذف شد",
                    icon:'success',
                    buttons:'بستن'
                }).then(() => getAllArticles())
              }
            })
            }
        })
        }
    
const createNewArtice =(event)=>{
    event.preventDefault()
    const localStorageData = JSON.parse(localStorage.getItem('user'))
    let formData = new FormData()
    formData.append('title',formState.inputs.title.value)
    formData.append('shortName',formState.inputs.shortName.value)
    formData.append('description',formState.inputs.description.value)
    formData.append('categoryID',articleCategory)
    formData.append('cover',articleCover)
    formData.append('body',articleBody)

    fetch(`http://localhost:4000/v1/articles`,{
        method:'POST',
        headers:{
          'Authorization':`Bearer ${localStorageData.token}`
        },
        body:formData
    }).then(res => {
        if(res.ok){
            swal({
                title:'مقاله مورد نظر با موفقیت اضافه شد',
                icon:'success',
                buttons:'بستن'
            }).then(result =>{
                console.log('article create:',result);
                getAllArticles()
            })
    }
    })
}

const draftArtice = (event)=>{
  event.preventDefault()
  const localStorageData = JSON.parse(localStorage.getItem('user'))
  let formData = new FormData()
  formData.append('title',formState.inputs.title.value)
  formData.append('shortName',formState.inputs.shortName.value)
  formData.append('description',formState.inputs.description.value)
  formData.append('categoryID',articleCategory)
  formData.append('cover',articleCover)
  formData.append('body',articleBody)

  fetch(`http://localhost:4000/v1/articles`,{
      method:'POST',
      headers:{
        'Authorization':`Bearer ${localStorageData.token}`
      },
      body:formData
  }).then(res => {
      if(res.ok){
          swal({
              title:'مقاله مورد نظر با موفقیت اضافه شد',
              icon:'success',
              buttons:'بستن'
          }).then(result =>{
              console.log('article create:',result);
              getAllArticles()
          })
  }
  })
}

const editArticle = ()=>{

}
    return ( 
        <>
              <div class="container-fluid" id="home-content">
        <div class="container">
          <div class="home-title">
            <span>افزودن مقاله جدید</span>
          </div>
          <form class="form">
            <div class="col-6">
              <div class="name input">
                <label class="input-title" style={{ display: "block" }}>
                  عنوان
                </label>
                <Input
                  element="input"
                  type="text"
                  id="title"
                  onChangeInputHandler={onChangeInputHandler}
                  validations={[minValidator(8)]}
                />
                <span class="error-message text-danger"></span>
              </div>
            </div>
            <div class="col-6">
              <div class="name input">
                <label class="input-title" style={{ display: "block" }}>
                  لینک
                </label>
                <Input
                  element="input"
                  type="text"
                  id="shortName"
                  onChangeInputHandler={onChangeInputHandler}
                  validations={[minValidator(5)]}
                />
                <span class="error-message text-danger"></span>
              </div>
            </div>
            <div class="col-12">
              <div class="name input">
                <label class="input-title" style={{ display: "block" }}>
                  چکیده
                </label>
                

                <Input
                  element="textarea"
                  type="text"
                  id="description"
                  onChangeInputHandler={onChangeInputHandler}
                  validations={[minValidator(5)]}
                  className="article-textarea"
                />
                <span class="error-message text-danger"></span>
              </div>
            </div>
            <div class="col-12">
              <div class="name input">
                <label class="input-title" style={{ display: "block" }}>
                  محتوای مقاله     
                 </label>
                
                <TextEditor value={articleBody} setValue={setArticleBody}/>
                <span class="error-message text-danger"></span>
              </div>
            </div>

            <div class="col-6">
              <div class="name input">
                <label class="input-title" style={{ display: "block" }}>
                  کاور
                </label>
                <input
                  type="file"
                  onChange={(event) => {
                    setArticleCover(event.target.files[0]);
                  }}
                />
                <span class="error-message text-danger"></span>
              </div>
            </div>
            <div class="col-6">
              <div class="name input">
                <label class="input-title" style={{ display: "block" }}>
                  دسته بندی
                </label>
                <select
                  onChange={(event) => setArticleCategory(event.target.value)}
                >
                  <option value="-1">دسته بندی مقاله را انتخاب کنید،</option>
                  {allCategories.map((category) => (
                    <option value={category._id}>{category.title}</option>
                  ))}
                </select>
                <span class="error-message text-danger"></span>
              </div>
            </div>
            <div class="col-12">
              <div class="bottom-form">
                <div class="submit-btn">
                  <input type="submit" value="انتشار" onClick={createNewArtice} />
                </div>
              </div>
              <div class="bottom-form">
                <div class="submit-btn">
                  <input type="submit" className="mx-3" value="پیش نویس" onClick={draftArtice} />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
         <DataTable title='مقاله ها'>
         <table className="table">
          <thead>
            <tr>
              <th>شناسه</th>
              <th> عنوان مقاله </th>
              <th> نویسنده</th>
              <th>لینک</th>
              <th>وضعیت</th>
              <th>ادامه مقاله</th>
              <th>ویرایش</th>
              <th>حذف</th>
            </tr>
          </thead>
          <tbody>
            {allArticles.map((article,index)=>(
            <tr key={article._id}>
              <td>{index + 1}</td>
              <td>{article.title}</td>
              <td>{article.creator.name}</td>
              <td>{article.shortName}</td>
              <td>{article.publish === 1 ? "منتشر شده":'پیش نویس'}</td>
              
              <td>
                  {article.publish === 1 ? (<i className="fa fa-check"></i>) : (
                      <Link to={`draft/${article.shortName}`}  className="btn btn-primary edit-btn">
                      ادامه مقاله 
                    </Link>
                  )}
              
              </td>
              <td>
                <button onClick={()=> editArticle(article._id)} type="button" className="btn btn-primary edit-btn">
                  ویرایش
                </button>
              </td>
              <td>
                <button onClick={()=> deletearticle(article._id)} type="button" className="btn btn-danger delete-btn">
                  حذف
                </button>
              </td>

            </tr>
            ))}
          </tbody>
        </table>
         </DataTable>
        </>
     );
}
 
export default AdminArticles;