import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik } from 'formik';


export default function Product() {
   
    const [field, setField] = useState({
        user:[],
    })
   
    const [formvalues,setFormvalues]=useState({});
    const initialValue = {
        name:'',
        price: '',
        quantity: '',
        id: '',
    };

    const validate = (formData) => {
        
        var errors = {};
        if (formData.name === '') errors.name = 'name is Required';
        if (formData.price === '') errors.price = 'Price is Required';
        if (formData.quantity === '') errors.quantity = 'quantity is Required';
        if (formData.id === '') errors.id = 'id is Required';
        return errors;
    };
   


const onPopulateData=async (id)=>{
    const selectedData=field.user.filter((data)=>data.id==id)[0];
    console.log(selectedData);
    await setFormvalues({
    name:selectedData.name,
    price: selectedData.price,
    quantity: selectedData.quantity,
    id:selectedData.id,
   })
}
const handleSubmit = async (formData,{resetForm}) => {
    if(formvalues.id){
        
        var res=await axios.put(`https://6201fb9cb8735d00174cb687.mockapi.io/product/${formvalues.id}`,
            {name:formData.name,
            price:formData.price,
            quantity:formData.quantity,});
            
        var index=field.user.findIndex(row=>row.id==res.data.id);
        var user=[...field.user]
        user[index]=res.data;
        await setField({user})
        
        formData.name='';formData.price='';formData.quantity='';formData.id=''; 
        await setFormvalues({});
        resetForm();
                   
    }
    else{
       
        var res=await axios.post('https://6249738f831c69c687cde72c.mockapi.io/product',
          { name:formData.name,
            price:formData.price,
            quantity:formData.quantity,});
        
        var user=[...field.user]
        user.push(res.data);
        await setField({user})
        formData.name='';formData.price='';formData.quantity='';
        await setFormvalues({});
        resetForm({});
       
    }
    
};
const handleDelete= async (id)=>{
    await axios.delete(`https://6249738f831c69c687cde72c.mockapi.io/product/${id}`)
    var user=field.user.filter((row)=>row.id!=id)
    setField({user})
}
useEffect(() => {
    const res = async () => {
      let resp = await axios.get(
        "https://6201fb9cb8735d00174cb687.mockapi.io/product"
      );
      setField({user:resp.data});
      console.log(field.user);
       
    };
    res();
  }, []);
    return (
        <div style={{ padding: '15px', margin: '15px' }}>
            <div>
                <h3>Formik with CRUD Operation</h3>
                <Formik
                    initialValues={formvalues || initialValue}
                    validate={(formData) => validate(formData)}
                    onSubmit={(formData,{resetForm}) => handleSubmit(formData,{resetForm})}
                    enableReinitialize
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        resetForm
                        /* and other goodies */
                    }) => (
                        <form onSubmit={handleSubmit} >
                            <div>
                                <label> Name : </label>&nbsp;
                                <input
                                    type="text"
                                    name="name"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <br />
                                <span style={{ color: 'red' }}>
                                    {touched.name && errors.name}
                                </span>
                            </div>
                            <br />
                            <div>
                                <label> Price: </label>&nbsp;
                                <input
                                    type="text"
                                    name="price"
                                    value={values.price}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <br />
                                <span style={{ color: 'red' }}>
                                    {touched.price && errors.price}
                                </span>
                            </div>
                            <br />
                            <div>
                                <label> Quantity: </label>&nbsp;
                                <input
                                    type="text"
                                    name="quantity"
                                    value={values.quantity}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <br />
                                <span style={{ color: 'red' }}>
                                    {touched.quantity && errors.quantity}
                                </span>
                            </div>
                            <br />
                            <div>
            <button type="submit" disabled={isSubmitting} >Submit</button>&nbsp;&nbsp;
            <button type="reset" onClick={resetForm}>Reset</button> &nbsp;&nbsp;
        </div>
                        </form>
                    )}
                </Formik>
            </div>

            <br /><br />
            <div>
                <h3>Data From API</h3><br />
                <table className='table' border='2' >
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Price</td>
                            <td>Quantity</td>
                            <td>id</td>
                            <td>Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                       {
                           field.user.map((ele)=>{
                             return <tr key={ele.id}>
                                 <td>{ele.name}</td>
                                 <td>{ele.price}</td>
                                 <td>{ele.quantity}</td>
                                 <td>{ele.id}</td>
                                 <td>
                                     <button onClick={()=>onPopulateData(ele.id)}>Edit</button>&nbsp;&nbsp;
                                     <button onClick={()=>handleDelete(ele.id)}>Delete</button>&nbsp;&nbsp;
                                 </td>
                             </tr>
                           })
                       }
                    </tbody>
                </table>
            </div>
        </div>
    )
}