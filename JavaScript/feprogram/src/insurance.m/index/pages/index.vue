<template>
    <header class="top_title">
        <a href="javascript:void(0);" class="return"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAeCAYAAAAl+Z4RAAAAAXNSR0IArs4c6QAAAr9JREFUOBGVlEtoU1EQhnvzgojgEwSji4AxuAgESgUVi6jx1TxIIVCq+FipS90JgoIoiAtBCnHlRkQwmnctVavtRkQi3WgWyaIuCl0VXWiUPP3m9t5wE5MmOXByzpnz///MnZkTZWjA0Wg0FL/fPwXtpKIod80D8odyudxjOFeYW5n7TIMIBAKBh+AvMxVmgwhmZNPXIOx7hH9DB0N+mslkLvQVAeSbRjIiMbvdfgmRRk8ByNch3zF4zjgcjrOxWKwmtnWTODY2dhXMIwP5jdPpHI9Go+WmTd+0ryTsYr1ef4JdzRPhLhD2aTz/MWI7JhHPExCeEbr6iew/QfZB/mUky/4/ATyH8PySO4sKUJRFi8VyNJlM/pRz+2jJQTAYPIXXOCCrAPH8zWq1CvlHO1E/N6tAto/gOY6ATbssEPbxRCKxqoM7reonhEKhg7VabRbyRgHheclms43G4/HlTiSjTeGbT+A5gXGDdrFsMplG6bIlI7Db3oTXBzoZz6t4PtYvWUQlB2pHyQExc7lc1nMgpp7DhNdroH5ryM2sb8Ph8N6eTA2gJpHGGeY8x9yk2Zcp32HK9107d13UMk5PT3+hWc6A0iPZVa1W31NaR1emdtHsg1Qq9dFsNgew/5U78uFkmaO5dsi522gKCCCdTn+ghOPkRX1tiLjpD8nJtr4EBEQJZ1gmmFU5MzxUZjYSiej5WbNqvy0R6DfZbDZBJOeJpK7Zhkul0mtE1E7VcbK2PCbjRaFQ+OpyuaSVg0yp1u5KpXLA6/W+yOfzenTdBUSsWCwuut1ueUxSIRlORIYRiSHS+y9NGETyGZESW5+cGXsosWdycvLV/Px8XW2kNfv6v/TELapy24B6PjIycq5rDgxAdUskC0QiL/aQdudZWVnZ2beAkBB5h8h2tvs1kS19f4JGkA5V6M4pVh9lvv8P2UT5ZwHVEw0AAAAASUVORK5CYII=" alt="Alternate Text" /></a>
        <a href="javascript:void(0);" class="center fontSize_17">易鑫车险</a>
        <div class="head_city" style="position: absolute; right: 0.4rem; top: 0px; color: #333;">
            <a id="TopCityTrigger2" class="cityName fontSize_12" href="javascript:void(0);" v-bind:CityId="CityId">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAYAAACe0YppAAAAAXNSR0IArs4c6QAABSdJREFUWAm1l1tMXFUUhplhZrBEDWmgRkpj6gOQ+NAYBjVeUqS1Dx2gBEQbUYO2L15iNE0wsRoxtkSNsalJ+6L4oOI8gNBwaUQSSmL65KAhTbUzxKYxME0UadIHCAwXv39y9vRw5sxwKd3Jnr33Wv9a/95rr7POGU/OOlpbW5t3bGzscaD1KysrFfRij8dTzOhDdoN+lXWEPlRRUTEMfnEtt55sgJaWlrump6ffAnMMkh3ZsEYH+TTYLwsKCk53dnbeNHLnmJG4tra2EQen6LssoxhOz7EeDgQCf/t8vvjs7Kzf6/XuRvYgmD2MLYwlwoONDgwMlGvu1hSqVQ1jT11d3Ynl5eX3LMUYzlv7+/tHVgFvLRTq3+jdTU1NbfPz84eWlpZeYz19C5I+W3VikXLSMOPzQBfZ9dsQnmVcSTe9PcmqE+ukFumN3Nzcxr6+vguQ3h5DBuuUV90p4e0GtwjpAZFmsNmUuKGh4QH8znZ1df0rB179KHs56SnNFd6tJpVf7n58bm7uElG9R+sksR4ZiJW9Y7pTKe5AuwLHffR35Nuj4hCJRK4j2EH27suSvTlglHxHGY8QmYfkgPll5h3Yfc2YMQlDodBh4GEw/wSDwZ1y9CR3+wvC2ODgYJmcuTXu6P6FhYXvIap20+NwhOf7xZ6enutueg7o44BXsd8FNqRQ1wvI4pybgWSAPTbSSSLzQl5eXrG65kAmtSELk0pYuz+rjH5j+dvvw6DCWgzbgfa5FV6ddDI/P38PmTlj04cpHENUsXGRC4vuK5s+NWWTFykuWj/iBVysmcqgRrcG5ojkGLY6SJNwyaTTwmCTCscPV/qHRER3t5efJLFqrwOXWoJJJpLf7x9NCR0TozNYhzq5LCws/E8TNrddd5zMRJ4z17tJWmzRz8zMjF+u2FxCxFNasIudGt0ausuSJxKJKje9XWewbjgbx1SKmF2Y11+aDboOCbmjz0ik7U6AZNJJbrBOjKUzHFN6SYzT92G4n9E1s1UcyNbD7Lha2cu81dypooBMpCWQjliFhGV6szikGPdSuH/UDKeNGt0aDldUHOQYfQkOfiAn4uqaSyadhclYvQyHOD0sVL1UAPQd9TRfDaNu5JJZ2KOMGy6ZNTU1VdjpNRsnKiXJTKaO6mvjJMLfqaNBqsxyJvLNyK33QQTih7E/TmluV3LlFBUVfcFwTQrqqT5btrTJp0V6zeLKST27vCcbKGe67wR3EOKd7JpoG90Rfp/B7yB2fiLawFX2ykeucRSNRv8sLy8PsLMqZPXMh5FlrGbGLtsIaZDkOw9mGyW1HdIzBp86sRGQBN9C/hLrm5z8ICe/aHQbGSF9gpOK9F5O+h2kL9vtk3dsF5Bbr7IOywDDITK+2q5fz1w2nPRn+aCHLZ+rTFOhNtLR0dHl5ubm3ng8rg/zR+nPlZWV/RqLxf4ymGwjpAeIWB89H1xHZWXlK2T1ktMmLdQGgKE+7M+wc2X5vJUYCl3GxjUdxK4HQB79LOF9EzvXgpIWauNVBjzorzOethz1cpoao3eOlk4ZmycbntU3MpHKNi3UToeE+KfS0tK7kT9Ff5awX0IWteMgPcRJu+kB5J9Desyud5uvSSyjiYmJYci3Md2L80YeNZFfkQ7Seq6ji6lIP4X0XcnXahnv2M0QkpOQqLwmeC4/YROq9SLSv8Z2rua4m52bbEPEckACfQzZ+3Zn3OUJEukDu2yt+bpCbXdCiC8QdiXlXskh/QjSD+2YOzon7I+pb5bkf51SooP395TzAAAAAElFTkSuQmCC" alt="Alternate Text" />
                <span class="fontSize_12" name="CityName">{{CityName}}</span>
            </a>
        </div>
    </header>
    <div id="bannerCtn" class="swiper-container swiper-container-horizontal" :from="isApp" data-proportion="0.29"><!--  @mySwiper="bannerSwiper" -->
        <div class="swiper-wrapper">
            <div class="swiper-slide">
                <a href="javascript:void(0);">
                    <img src="../../comm/images/banner/insurance_suning.html.jpg" alt="">
                </a>
            </div>
            <div name="bannerImg" class="swiper-slide swiper-slide-prev">
                <a href="javascript:void(0);" class="">
                    <img src="../../comm/images/banner/chexian.html.png" alt="买车险就上chexian.com">
                </a>
            </div>
            <div name="bannerImg" class="swiper-slide swiper-slide-prev">
                <a href="javascript:void(0);" class="">
                    <img src="../../comm/images/banner/chexian_banner1.html.jpg" alt="易鑫车险，每满1000送350京东E卡">
                </a> 
            </div>
            <div name="bannerImg" class="swiper-slide swiper-slide-prev">
                <a href="javascript:void(0);" class="">
                    <img src="../../comm/images/banner/chexian_banner.html.jpg" alt="易鑫车险，车险网上买，低至3折">
                </a>
            </div>
            <div name="bannerImg" class="swiper-slide swiper-slide-prev">
                <a href="javascript:void(0);" class="">
                    <img src="../../comm/images/banner/chexian_banner3.html.jpg" alt="易鑫车险，理赔服务无差异，更享一键报案">
                </a>
            </div>
            <div name="bannerImg" class="swiper-slide swiper-slide-prev">
                <a href="javascript:void(0);" class="">
                    <img src="../../comm/images/banner/chexian_banner2.html.jpg" alt="易鑫车险，上年未出险，折扣更低，礼品更多">
                </a>
            </div>
            <div name="bannerImg" class="swiper-slide swiper-slide-prev">
                <a href="javascript:void(0);" class="AXATP1">
                    <img src="../../comm/images/banner/insurance_axatp.html.jpg" alt="易鑫车险保费低至5折，折上再减20%，车险最高返2000">
                </a>
            </div>
            <div name="bannerImg" class="swiper-slide swiper-slide-prev">
                <a href="javascript:void(0);" class="CGB">
                    <img src="../../comm/images/banner/insurance_cgb.html.jpg" alt="易鑫车险联合广发银行，买车险，折上折">
                </a>
            </div>
        </div>
        <div id="bannerPagination" class="swiper-pagination center"></div>
    </div>
    <!-- @*首屏小工具*@ -->
    <div class="tab_tit toolList   clearfix">
        <div class="" id="comparablePriceSubmit">
            <a href="javascript:void(0);">
                <img src="../images/chexianbijia.png" alt="" />
                <p class="fontSize_13">车险比价</p>
            </a>
        </div>
        <div class="juejin">
            <a href="javascript:void(0);">
                <img src="../images/bangmaizhuan.png" alt="" />
                <p class="fontSize_13">帮买赚</p>
            </a>
        </div>
        <div class="claimGuide">
            <a href="javascript:void(0);">
                <img src="../images/lipeizhiyin.png" alt="" />
                <p class="fontSize_13">理赔指引</p>
            </a>
        </div>
        <div class="mine">
            <a href="javascript:void(0);">
                <img src="../images/mine.png" alt="" />
                <p class="fontSize_13">我的</p>
            </a>
        </div>
    </div>
    <div class="LatestOffer clearfix">
        <span class="fontSize_13">最新优惠</span>
        <div id="recentCtn" class="recentCtn swiper-container  swiper-container-horizontal">
            <div class="swiper-wrapper swiper-no-swiping"></div>
        </div>
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAUCAYAAAC58NwRAAAAAXNSR0IArs4c6QAAAZxJREFUKBWFkjtLA1EQhXcvqwaiRUQrS0llJQhCuhBBRG0UVgQLIa/GRlF/gZWoYCV5iQRRSBML3UIsBCGV4n8wlY0BFQvZZP0mZkMk2fXC4dzMnDMzubN6Npu1HMcZ1jTNTKfTL7DvUYiDKKZBBfOEr5qkCgaDi7qu33Mfw/yAKeJn0iVpWdZAtVq94LoEvoCMdwN3naZBolRXVD/hmgK2UiqeTCaLkus8yv3BWA2qpuE9YgYFziiw7eZdbndwA8KZTGYDOgaKAgd02oUdyfU0SCKXy63QpQj6ERfD4XA8Go3angYxMdIMhjLXQSCPYPoaEGiFQmGqXq/LckfpdNf+05LsdRC9IX5v5UZ8Dfl8ftK27QricfAYCARmPUdCHGs0GmWqDyG+DYVCy6ZpfvbswAutIpa5RXwOFkQMdz8rO9hk7kPE0N8diKHdQQSI94kdSYKzlUqldjA1F/YbanVA2EfgFKwh+AbrbPfSFXWyKpVKspTrlvgDnvcSi9Go1WpXcIyqr3yhc4lE4lkSXkc+Lhs8GYYR+U8sRX4A5zOflob5YUgAAAAASUVORK5CYII=" alt="Alternate Text" />
    </div>
    <div class="business_box mar_top_20 clearfix">
        <p class="fontSize_10 Superscript">超值</p>
        <ul class="titList">
            <li class="active fontSize_13">
                <a href="javascript:void(0);">热门品牌</a>
            </li>
            <li class="fontSize_13">
                <a href="javascript:void(0);">性价比高</a>
            </li>
            <li class="fontSize_13">
                <a href="javascript:void(0);">0息分期</a>
            </li>
        </ul>
        <div class="box">
            <ul class="listInfo clearfix">
                <li id="PAIC" class="activity clearfix">
                    <a href="@pinganUrl" class="clearfix" title="中国平安车险、中国平安、平安车险">
                        <div class="logo"></div>
                        <div class="pro_info">
                            <h3 class="fontSize_14">抽红包</h3>
                            <p class="fontSize_12">0~1000抵保费</p>
                        </div>
                    </a>
                </li>
                <li id="PICC" class="activity">
                    <a href="javascript:void(0);" class="clearfix" title="中国人保车险、中国人保、人保车险">
                        <div class="logo"></div>
                        <div class="pro_info">
                            <h3 class="fontSize_14">值得信赖</h3>
                            <p class="fontSize_12">3000以上送100</p>
                        </div>
                    </a>
                </li>
                <li id="CPIC">
                    <a href="javascript:void(0);" class="clearfix" title="中国太平洋车险、中国太平洋、太平洋车险">
                        <div class="logo"></div>
                        <div class="pro_info">
                            <h3 class="fontSize_14">3分钟投保</h3>
                            <p class="fontSize_12">投保礼高至30%</p>
                        </div>
                    </a>
                </li>
                <li id="AXATP">
                    <a href="javascript:void(0);" class="clearfix" title="安盛天平车险、安盛天平保险">
                        <div class="logo"></div>
                        <div class="pro_info">
                            <h3 class="fontSize_14">好司机省更多</h3>
                            <p class="fontSize_12">最高劲省38%</p>
                        </div>
                        <b class="discount_icon fontSize_11">推荐</b>
                    </a>
                </li>
                <li id="CIC">
                    <a href="javascript:void(0);" class="clearfix" title="中华联合、中华联合保险">
                        <div class="logo"></div>
                        <div class="pro_info">
                            <h3 class="fontSize_14">服务升级</h3>
                            <p class="fontSize_12">回馈高至40%</p>
                        </div>
                    </a>
                </li>
                <li id="CCIC">
                    <a href="javascript:void(0);" class="clearfix" title="中国大地车险、中国大地、大地车险">
                        <div class="logo"></div>
                        <div class="pro_info">
                            <h3 class="fontSize_14">上门理赔</h3>
                            <p class="fontSize_12">投保礼高达30%</p>
                        </div>
                    </a>
                </li>
            </ul>
            <ul class="listInfo clearfix">
                <li id="PAIC" class="activity clearfix">
                    <a href="@pinganUrl" class="clearfix" title="中国平安车险、中国平安、平安车险">
                        <div class="logo"></div>
                        <div class="pro_info">
                            <h3 class="fontSize_14">抽红包</h3>
                            <p class="fontSize_12">0~1000抵保费</p>
                        </div>
                    </a>
                </li>
                <li id="AXATP">
                    <a href="javascript:void(0);" class="clearfix" title="安盛天平车险、安盛天平保险">
                        <div class="logo"></div>
                        <div class="pro_info">
                            <h3 class="fontSize_14">好司机省更多</h3>
                            <p class="fontSize_12">最高劲省38%</p>
                        </div>
                        <b class="discount_icon fontSize_11">推荐</b>
                    </a>
                </li>
                <li id="CIC">
                    <a href="javascript:void(0);" class="clearfix" title="中华联合、中华联合保险">
                        <div class="logo"></div>
                        <div class="pro_info">
                            <h3 class="fontSize_14">服务升级</h3>
                            <p class="fontSize_12">回馈高至40%</p>
                        </div>
                    </a>
                </li>
                <li id="CPIC">
                    <a href="javascript:void(0);" class="clearfix" title="中国太平洋车险、中国太平洋、太平洋车险">
                        <div class="logo"></div>
                        <div class="pro_info">
                            <h3 class="fontSize_14">3分钟投保</h3>
                            <p class="fontSize_12">投保礼高至30%</p>
                        </div>
                    </a>
                </li>
                <li id="PICC" class="activity">
                    <a href="javascript:void(0);" class="clearfix" title="中国人保车险、中国人保、人保车险">
                        <div class="logo"></div>
                        <div class="pro_info">
                            <h3 class="fontSize_14">值得信赖</h3>
                            <p class="fontSize_12">3000以上送100</p>
                        </div>
                    </a>
                </li>
                <li id="YGBX">
                    <a href="javascript:void(0);" class="clearfix" title="中华联合、中华联合保险">
                        <div class="logo"></div>
                        <div class="pro_info">
                            <h3 class="fontSize_14">24h闪赔</h3>
                            <p class="fontSize_12">每满1000送250</p>
                        </div>
                    </a>
                </li>
            </ul>
            <ul class="listInfo clearfix">
                <li id="BOCI">
                    <a href="javascript:void(0);" class="clearfix" title="中银保险">
                        <div class="logo"></div>
                        <div class="pro_info">
                            <h3 class="fontSize_14">车险分期付</h3>
                            <p class="fontSize_12">还享多种好礼</p>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <h3 class="index_tit mar_top_20"><span class="main fontSize_14"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAABJZJREFUWAntV29oW1UUv+e+1za2c3PdUKQ4pt2KCA6lDpz6YRPmSl+S7g/PqelmOsdAPw7ccCArigzROVlBpUOsbVZhsNLmT6lUB/swK1tlik4WRF0/yMY6GVOarHl5Of5umsSXbknTJl8Gu5DcP+ec3/m9c8879z4hymxXW7wj+J0sE0bo5QIw8yZBFC8XR5YLQEIwMLQK4JQO4fHsqWWOr2cWLYJ4A/pV4OGaQSALa1eI6YKQ4ltd6l8PDfX8XCo6Hmju1tbW8VDStg7B8bb/Hc9tRyTOsqSDw8HAyFzaRYnMRCC2jwXvA4l70mBEUTg4IVJivLpaXtR17Xos5koKMb2UKLGCmZpBdgOisxE21RkCZ0SNyzc88PlEIUIFiRjG60uF+GcUCdBMRP8iE/qJ5JfhcO9YITDnumnuWRK7OeXjFO0FsUaQvyZJbg+F+k459bLj2xIxzdfqp+LT3wjmJ6F4SdeoJRgMRLNG8+lN84QWjwffTjEfhF0SWK3AGp2NcQsRv9/vmpy0xhCJJyD8saaGWgcGApdnG8537na37wWZw4ju31W6/tTgYM8lJ8Ytr+/kpP1WmgTRn0Isfr4SJJTDcDjwEQn6EHVnmZW0+p0k1DiPiNvtX43E3C8E3dSk3BaJfHp9tkE584aG2gMofueQxOsMb7vhxMojwpw8isSqEZIOBIO9552KlRh3d3dbqDO7gMWcEipnci1HZPNm/0pEowV7+Ffjyvs+yWlUeBCJ9P0iSIyAylqPx/9oFj5HxLKS29OLJD7u6uqazipUqu/s7MydaxpRt8LFDmzK4ufemla3L4Ra4SadniWbPClOvYRcqQf7y8Q8JqXsQQ04rQwV6Pj477sRwVew3+mnQp2Iooh91fBg3TG1BUrPaGt/hm3RAY9bMa1Hsl5BP6TrfNRK0g+wORUJB9K5kiNiGO2/Ahig9EemACUwnkaW36tA043oCzzNuzbzIMDXZJczwinY1QH8AtLMy5TYAR2VB8oHKi8hylyXsbkBPQtV+MZwJIDzyvHW4JVdgTnk/JPQ5dOPPFy/OBzqW1Jdpa8Ckn/GAXfYKY4ick0k5HtKpkAgSwBwkSa1VkyXs0hcBIlOjL8joW2sq21zKbmkqiaS4jDWIRbL8Y/fTMuLCBK1LxzuO5QVOnu1HWfHf3sHJF7WpHgxFDp+TslbDR8rIpHw8Ro193p3rkmmUqPA6l/b3Pgm7BCN/LZly477EwnuQqxewNbgKKlAA5GU4fblJbdpdmYPu6IeTPONRUUV5iO8HZH52Gd1c69vdmEhPZIut8ULsVc2FSGyUOdOu7tEnNFQ47sRubMjYhi+URSt9Ik5+0kyc7vAesnLJeUIC1oHxF3qIuxE9np3P4A5agirU7WsVhIReJjAIaVNWcOPO73ZdjxzhOPrrsyWu6wUw8GJeRJXu8comTzi8ex81eVaNhmLXXPj2nAE0RAs5bFi9qXISiKiUfUHNk2buJust9memIpdxa0hfc9Q/58Nh3qHSnFWTCdvzwspRqPnE02rn+uXlMBWEr7aCPcj+l6Sth/H+PuF7O7I9f8AvOOvBercBCgAAAAASUVORK5CYII=" alt="Alternate Text" />车险小工具</span></h3>
    <ul class="insurance_tool clearfix">
       <li class="clearfix a_half xubao" id="remindSubmit">
            <a href="javascript:void(0);" class="clearfix" title="车险续保提醒">
                <img src="../images/xubaotixing.html.png" alt="Alternate Text" />
                <h3 class="fontSize_14">续保提醒</h3>
                <span class="bottom fontSize_12">不用再担心脱保</span>
            </a>
        </li>
        <li class="clearfix a_half ruhexuan" id="InsuranceTypeChoose">
            <a href="javascript:void(0);" class="clearfix" title="车险险种如何选、如何选车险、车险必选险种">
                <img src="../images/xianzhongruhexuan.html.png" alt="Alternate Text" />
                <h3 class="fontSize_14">险种如何选</h3>
                <span class="bottom fontSize_12">1分钟了解车险</span>
            </a>
        </li>
    </ul>
    <h3 class="index_tit mar_top_20"><span class="main fontSize_14"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAiCAYAAAA+stv/AAAAAXNSR0IArs4c6QAABQVJREFUWAntWF9sk1UUP+f2a8sK2+JinEGCCOJGjDHEYZbIgw9E/mzt4qAF7QaKYYMIskQYvpj0SZNBcCNMYcNpNiaM/dG222DEBx/gCXkVyACJ4lRMFvevbO3Xezzft96m61a2NfNt9+V899xzfufXc+93v3OKkMbw+XzajRv3dgBQleGOKL4oKFjdyXp9vnA4Hwe3+4OcsfHxCpD4IQdfMdUXHzLYaYfD3tje/vXg1LXUszkRKHq7fB2E6TAglBORg+EIEYMWYakxoKMyWs16Jz+yGkME1IxWcarn+5ZbxvqTRkoCDIhFJeWbUVIVEbzFIIwNYQBxHqxwIhncJBmBIwCyjO1tbE8I2Mdutd3dzVfZmWYiMo2A01nhIHq8mwl8xL9k3aQTDguEs0LYagOBpoGZgJTO5dq7XMpwlSSoZA5Zhp6J3CIBdRZwtASDDSFlO7kWm5WWeldMTOBBDrqPVTnmIsIAgqjLzpZnWltbh2OmcxJerzdraEjsJ5CHOSPLY06DAkWDzSbru7paH5oxnE5vYZSgCgi2s0IzlcyY2Z9wONaeb2/3cdrTH263zxYK9ZdxGo4ykfwYks5b0kEWrMVtRd7EvbnO6arp7m4JptqzdKkYZ6q4uNzJGa62A7wxEQMyf7HxfE4fhj9QvHKPtNd5GoytL5zweMQ+khtfkPqrz5KE/VomTBinQ2XgGyagxj8gJvpRuxAZzz3k+enLUaVPR/Zu9WZFaLz+JdA9OSSNt8Mc0wjsocjBlRT+dLWM5iqjUcToL2i9OmrTK9/x+39X+rnIztLS5x0hOJsH+qalRBbl8wC1RwNC+6wRbbWGLp6B3p5W85X8rtjjXB4Nn8yT0TXCeIN4hAHpltBuDlttB3YELv5s6FKNDteuguxI+Kt8GXmNf67pz4eM+oV2fwCsR3ZevvSD4asyP42AAr7g2l7wdIQYSGcgvlN4GEC3Ubv/l7B9vKu3za9sDdm21ePMJf1kPkXWsHGMONAdYb05ZsUDJYHOKcRnJaDALzndK5fpsiFP6puWgZyWSs6Onrx1Y7x1d0D7ccRqqfAE239TWIlSEYi/BYmLic8xgC1+195MDP9bvxaiO43DtIr0Z1ZFdXMflf0givBdPrxPWSOHtga6RpT+SZK3eW6jJNA04rrStTu/cH3GNWGt+RMt8QADKEauWeyfG2vOy53vbQwE4muzoc+agWQA9Pkk647xxfLJoy0u45nWX/Gbdz70diSbzzqfcwaSkRbqpkybQDKhdOeLBBYzsJiB+EXEd/O1/6saUq+oWWm79rhQymqujEx1/GuojIwKlsvv4xkZL7bOVg/+vZkrLL4Jc/uCT9xKsy4cv1cOJI8k1IVmSAGaKOSPZxvPzLbKKMUlUVPocf+v24rLjhrVrSI3X+l2V2QXFZUdGwvdfUBSnksIrpsxObb53TaAZyrLJwPiMNcjZzRhr0vuCVJloLh493NEsoqDVHLaMxOID3KGG+12Oh0vyxMWzceZGxOuMGJdkUDL8WDw29uGcTIBp3PPyxKiR7nmfJd3xqqwJ7cVTyFmNKdsTJSxkuaBSWrNYmtGeRQADWuaxoeus47et+e8iVHuD4G28VxllftHuEoCa3v8LX2pPl7KWMWdUc7QnJp26uQZ32Q1OFCID3gL2LAuuX9UNolyTgSUw2ztOQiqX7pkScOCt+eKgJLJf1Bw1ms3bFjTkc4fFP8Bp089/1IWkHQAAAAASUVORK5CYII=" alt="Alternate Text" />套餐推荐</span></h3>
    <ul class="Package_box">
        <li class="small_list" data-id="public">
            <img src="../images/dazhongxing.png" alt="Alternate Text" />
        </li>
        <li class="small_list" data-id="econ">
            <img src="../images/jingjixing.png" alt="Alternate Text" />
        </li>
        <li class="small_list" data-id="lux">
            <img src="../images/haohuaxing.png" alt="Alternate Text" />
        </li>
    </ul>
    <h3 class="index_tit mar_top_20"><span class="main fontSize_14"><img src="data:image/png;base64,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" alt="Alternate Text" />为你精选</span></h3>
    <div class="smallInsuranceList">
        <div class="box">
            <div class="swiper-container" id="smallInsure">
                <div class="swiper-wrapper">
                    <div class="swiper-slide swiper-slide-prev">
                        <dl class="changxian">
                            <dt><img src="../images/changxian.png" alt="Alternate Text" /></dt>
                            <dd>
                                <h3 class="fontSize_15">境内长线旅游</h3>
                                <p class="fontSize_12">1-30天保障&nbsp;最高保额20万</p>
                                <p class="fontSize_12 red">低至16元</p>
                            </dd>
                        </dl>
                    </div>
                    <div class="swiper-slide swiper-slide-prev">
                        <dl class="duanxian">
                            <dt><img src="../images/duanxian.png" alt="Alternate Text" /></dt>
                            <dd>
                                <h3 class="fontSize_15">境内短线旅游</h3>
                                <p class="fontSize_12">1-5天保障&nbsp;最高保额25万</p>
                                <p class="fontSize_12 red">低至12元</p>
                            </dd>
                        </dl>
                    </div>
                    <div class="swiper-slide swiper-slide-prev">
                        <dl class="gaoyuanyou">
                            <dt><img src="../images/gaoyuanyou.png" alt="Alternate Text" /></dt>
                            <dd>
                                <h3 class="fontSize_15">境内高原游保险</h3>
                                <p class="fontSize_12">1-30天保障&nbsp;最高保额20万 </p>
                                <p class="fontSize_12 red">低至19元</p>
                            </dd>
                        </dl>
                    </div>
                    <div class="swiper-slide swiper-slide-prev">
                        <dl class="zijiayou">
                            <dt><img src="../images/zijiayou.png" alt="Alternate Text" /></dt>
                            <dd>
                                <h3 class="fontSize_15">境内自驾游保险 </h3>
                                <p class="fontSize_12">1-14天保障&nbsp;最高保额10万</p>
                                <p class="fontSize_12 red">低至6元</p>
                            </dd>
                        </dl>
                    </div>
                </div>
                <div id="smallInsurePagination" class="swiper-pagination center"></div>
            </div>
        </div>
    </div>
    <h3 class="index_tit mar_top_20"><span class="main fontSize_14"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAABFFJREFUWAnVV91rXEUUP+fu3exmQ6giTbCIUJGKiG+++BdYk+yaWMR+ZIsPGvGpfqCiqAShUlTUNzVPNrsJ1UJMsh/EB0FfLFh9Ep+06EPF1oBLLJru/Zjjb+7u3dzZ3HTzcYU6sDvnnDn3zG/O+c3cuUQ3SeMb4Ziamko3Gnam2bzOg4PNwNdxBth1Hfz6Az2Xc9jzXPyygZ7Natlj388EupfxOOt7sPXxvn3uWqlU+jtuzsA5OjA9PW1fvHjplJA8w0wHRcSKju9NZpeYllkGn6rVPmxEY9lRRcvffvfzu0RyqmXn3wDmWrfP7nS2sai7SegI0bUBxHg4GsfISLFYHPizodbg4AinjtUrs0tR573KY2MnH1SivsZC09kMH1hYKP8exjTSvrZG94pQiohrSYPQE1arsxeI5Qstuy7drvuwGUBEVKtUQtdDh6R7Fv5Hx2RmY26DI75lCSllzL1aKAySw8dhzBEriQ6KYkNH9EDHn8dW38JQ/fyVqP+NZANIrKNLR1HXj4Ixc1qYugyoa6dJ8xDkZzt6D6E3kDSdsxwLaRTN9I3G2IiRppCOULVIeZzKnA/1uB406Pjr8Z5A9i8v6+37cVywJG0GYZIMvNNYRkYsn8WkKtHqyMQhpfwzyGMOlGiToE0GJgj81fDK8js7nbjb3wDSPdjS1QOYbiJCww03GAFQk/K/B7K/vjTfODz+jRI/ICvbdotkbbJ5A32/bCDbvbSNjBDdurL46+6n2N6TNydZ47BfPfzIQ0RqATTNoSYtqrRPUPhDly+HVirw2VkTSbVK3H7MKA2z39kXYVibrL98kst4WQUcIcHB1YKjmYoznf8IfffSG0DiAt228vkF2O+JG9vKNj7+xC1KWbm4cU85/Z2FRBx6Aon49hRH8pPHkKLTjuse7Onc5ZAYkHx+8oivZF5XDcX7Ed1llE2XMeACBP12uh8n4LDGkEpZ67oPW2JAwK43gqDM09VK6U3cN0ImBeaxsRMTSvhTzW8ge25p6ZMfQhC6T2T76ts+Vnwf1n/1jgO5t7pB6GzhJvMZQKTJsp6v1eY+iILYBASXJmMV3c5b6Y7jpJByXDGpMTMz40b9RkeLj6Fk52CzLeYX6pXS+9HxUE4kI2GwgBOhgh6X5cdx5ZuHaLPFL1ar5fciw4aYKJCQmHoGZOKokD8H0QZnX6pVyvhM2bolC6Q9Tz5/8jjut2VdLoutl+vVcs+3swEEH0Dd15GtlxAzgo3Co4UTk7jjlgLOWPRKtVp6O8Z1k8kAwtz3Exivwdyld8Im7x4GEb6TFJ/Vn6nIxKv1ytyZHo90ho0Xj7Ziv89iqxX1VsTR9D3qHvvR3IkQCJLCdns0tOGL5bVaZe50qG+n33Sg9fcPPb2+vnpFiUxh349sJ4jhw9brtUppRyD085syEg1aKDw5LNIMXl5K4cxCS6f9oMc9tt23bmzpNL62hP3FxbOXojH+d/K/xvF8BFf788UAAAAASUVORK5CYII=" alt="Alternate Text" />车主评论</span><em class="details moreEvaluate fontSize_12">更多评论<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAUCAYAAAC58NwRAAAAAXNSR0IArs4c6QAAAZxJREFUKBWFkjtLA1EQhXcvqwaiRUQrS0llJQhCuhBBRG0UVgQLIa/GRlF/gZWoYCV5iQRRSBML3UIsBCGV4n8wlY0BFQvZZP0mZkMk2fXC4dzMnDMzubN6Npu1HMcZ1jTNTKfTL7DvUYiDKKZBBfOEr5qkCgaDi7qu33Mfw/yAKeJn0iVpWdZAtVq94LoEvoCMdwN3naZBolRXVD/hmgK2UiqeTCaLkus8yv3BWA2qpuE9YgYFziiw7eZdbndwA8KZTGYDOgaKAgd02oUdyfU0SCKXy63QpQj6ERfD4XA8Go3angYxMdIMhjLXQSCPYPoaEGiFQmGqXq/LckfpdNf+05LsdRC9IX5v5UZ8Dfl8ftK27QricfAYCARmPUdCHGs0GmWqDyG+DYVCy6ZpfvbswAutIpa5RXwOFkQMdz8rO9hk7kPE0N8diKHdQQSI94kdSYKzlUqldjA1F/YbanVA2EfgFKwh+AbrbPfSFXWyKpVKspTrlvgDnvcSi9Go1WpXcIyqr3yhc4lE4lkSXkc+Lhs8GYYR+U8sRX4A5zOflob5YUgAAAAASUVORK5CYII=" alt="Alternate Text"></em></h3>
    <div class="evaluateListBox">
        <div class="listInfo clearfix">
            <ul class="clearfix">
                <li class="clearfix">
                    <a href="javascript:void(0);">
                        <div class="left">
                            <h3>
                                <img src="../images/2.png" alt="Alternate Text" />
                                <span class="fontSize_13">138****3478</span>
                            </h3>
                            <p class="fontSize_12">之前设置了车险到期提醒，顺着提醒就能轻松续保了。超级方便，我要把这个功能告诉小伙伴们！</p>
                        </div>
                        <div class="right">
                            <img src="../images/evaluateImg.jpg" alt="Alternate Text" />
                        </div>
                    </a>
                </li>
                <li class="clearfix">
                    <a href="javascript:void(0);">
                        <div class="left">
                            <h3>
                                <img src="../images/3.png" alt="Alternate Text" />
                                <span class="fontSize_13">182****7821</span>
                            </h3>
                            <p class="fontSize_12">看完介绍基本就知道该选哪些险种了，还能一次比较多家公司的价格，赞！</p>
                        </div>
                        <div class="right">
                            <img src="../images/evaluateImg1.jpg" alt="Alternate Text" />
                        </div>
                    </a>
                </li>
                <li class="clearfix">
                    <a href="javascript:void(0);">
                        <div class="left">
                            <h3>
                                <img src="../images/8.png" alt="Alternate Text" />
                                <span class="fontSize_13">156****8542</span>
                            </h3>
                            <p class="fontSize_12">上年没出险，折扣比往年更低，省下了几百大洋</p>
                        </div>
                        <div class="right">
                            <img src="../images/evaluateImg2.jpg" alt="Alternate Text" />
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <h3 class="index_tit mar_top_20"><span class="main fontSize_14"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAZpJREFUWAntlr1OwzAQx+9SiESQ2HgEHoKFuUoCW6dSXqMgEAiQ2HgBBoYiJKQMSC1lZeEJWNgZWBgQTKiDDzvYlRM5akgctYMrVYrP9/Hr/y6uAdxnQRVAwRVGXZon3+P4Fr15Aui1l/SFINPXTT/rnVgYRRxIvu1OkbwimbdGbVKn4398T84AaS+1EQ7W1/xjTJKJbR+VzwgiIAhYH6bHHPW5TcTsq0BbPiqfeUakEohe5AHGqbNSR0Xa8pH5zCByE4lmHnC2fMwgfCYECwN6EN+US9okI4AtH5nQOCNiMNOZUO2QwzqF4A+2fPSc6b+vfu5nNhtciJqqrrk1DRYvSu1A8so4RfKKZF5fNcF5J7HWb29x3DtgxC5MflVt/25NtN09/IPAn6pFTXEzj3ClklAkjHtHQOycB316XmtnNBo8m5JWsZUG4ff9E2JwiohvsIzt8f3Na5WCRTGlWyMgAPGl5fmbtiEEXGkQLt3T6kqwNRxevxf9qjr2UiC8HXdBsNFOkquvOsVqxYbx7iWVuJfUKuKCF1mBX1A2yfMxJuuUAAAAAElFTkSuQmCC" alt="Alternate Text" />常见问题</span></h3>
    <div class="question_box">
        <div class="swiper-container" id="questions_list" style="overflow: hidden;">
            <div class="swiper-wrapper index_question_list clearfix">
                <div class="clearfix swiper-slide" v-for="m in questionsObj">
                    <div class="ask_box">
                       <div class="left_icon fontSize_12">
                           <span class="fontSize_14">问</span>
                        </div>
                        <div class="right_box">
                            <div class="ask_main fontSize_13">{{m.questionsName}}</div>
                            <div class="ask_name fontSize_12">{{m.name}}&emsp;{{m.tel}}</div>
                        </div>
                    </div>
                    <div class="ask_box answer ">
                        <div class="right_box">
                            <div class="ask_main fontSize_13" v-html="m.main"></div>
                            <div class="ask_name fontSize_12">{{m.answer_name}}&emsp;<span class="time fontSize_12">{{m.answer_date}}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="slide_btn fontSize_12">
            <span class="fontSize_12">展开</span><i class="icon i13"></i>
        </div>
        <input type="hidden" id="CityId" value="201" />
        <input type="hidden" id="CityName" value="北京" />
        <input type="hidden" id="ProvinceId" value="110000" />
        <input type="hidden" id="LicensePlateCode" value="京" />
        <input type="hidden" id="RegionId" value="110100" />
    </div>
</template>
<script>
/*APP判断*/
// var isApp = comm.getCookie("YiXinAppInfo");
export default {
    data () {
        return {
            CityName:this.$parent.CityName,
            CityId:this.$parent.CityId,
            questionsObj: this.$parent.questionsObj,
        }
    },
    components: {
    },
    methods:{
    },
    created(){
        // $('body').addClass('theme-' + (comm.getUrlParam('theme') || 'a'));
        // this.CityName = this.$parent.CityName
        // console.log(this.$parent.CityName)
    }
}
</script>