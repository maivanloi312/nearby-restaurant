import { NotificationContainer, NotificationManager } from 'react-notifications';
import clientRequest from '../../APIFeatures/clientRequest';

const NewPassword=(props)=>{
    const Thumbnail=()=>{
        return (
        <>
        <div className="oblique position-absolute top-0 h-100 d-md-block d-none me-n8">
        <div className="oblique-image bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6" style={{backgroundImage: 'url("https://static.zara.net/photos///contents/2021/V/L/L21012-V2021//w/1280/Look6_1.jpg?ts=1615979341884")'}} />
    </div>
    </>
    )
    }
    const resetPassword=(e)=>{
        e.preventDefault();
        const stPassword=document.getElementsByName('password')[0].value
       const stConfirmPassword= document.getElementsByName('confirmPassword')[0].value
        clientRequest.resetPassword({password:stPassword,confirmPassword:stConfirmPassword},props.match.params.token)
        .then( res=>{NotificationManager.success('Success', 'Reset success')
        window.location.href='/login'
    })
        .catch(err=>{
        NotificationManager.error('Error', 'Reset Failed')
    })
        
    }
    return  <div className={'g-sidenav-show  bg-white'}>
    <div className={'container position-sticky z-index-sticky top-0'}>
        <div className={'row'}>
            <div className={'col-12'}>
</div>
</div>
</div>
<section>
    <div className={'page-header section-height-75'}>
        <div className={'container'}>
            <div className={'row'}>
                <div className={'col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto'}>   
                <form role="form text-left" onSubmit={resetPassword}>
        
        <label>Password</label>
        <div className="mb-3">
          <input type="password" name='password' className="form-control" placeholder="Password" aria-label="Password" aria-describedby="password-addon" />
        </div>
        <label>Confirm Password</label>
        <div className="mb-3">
          <input type="password" name='confirmPassword' className="form-control" placeholder="Password" aria-label="Password" aria-describedby="password-addon" />
        </div>
       
        <div className="text-center">
          <button type="submit"  className="btn bg-gradient-info w-100 mt-4 mb-0">Sign in</button>

        </div>
      </form>
            
                </div>
                <div className={'col-md-6'}>
                    <Thumbnail/>    
                </div>
            </div>
        </div>
    </div>
</section>

<NotificationContainer/>

</div>
}
export default NewPassword