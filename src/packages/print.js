/*
 * @Author: Lyun
 * @Date: 2020-01-14 01:41:04
 * @LastEditTime: 2020-07-28 15:31:29
 * @LastEditors: Do not edit
 * @FilePath: \vue-print-nb-z\src\packages\print.js
 * @Description: ...
 */
import Print from './printarea.js';
/**
 * @file 打印
 * 指令`v-print`,默认打印整个窗口
 * 传入参数`v-print="'#id'"` , 参数为需要打印局部的盒子标识.
 */
export default {
	directiveName: 'print',
	bind(el, binding, vnode) {
		let vue = vnode.context;
		let closeBtn = true;
		let id = '';
		el.addEventListener('click', () => {
			vue.$nextTick(() => {
				if (typeof binding.value === 'string') {
					id = binding.value;
				} else if (typeof binding.value === 'object' && !!binding.value.id) {
					id = binding.value.id;
					let ids = id.replace(new RegExp("#", "g"), '');
					let elsdom = document.getElementById(ids);
					if (!elsdom) console.log("id in Error"), id = '';
				}
				// 局部打印
				if (id) {
					localPrint();
				} else {
					// 直接全局打印
					binding.value.callback()
					setTimeout(()=>{
						window.print();
						binding.value.endCallback()

					})

				}
				// if(binding.value.mode){

				// }
			});

		});
		const localPrint = () => {
			if (closeBtn) {
				closeBtn = false;
				new Print({
					ids: id, // * 局部打印必传入id
					standard: '', // 文档类型，默认是html5，可选 html5，loose，strict
					extraHead: binding.value.extraHead, // 附加在head标签上的额外标签,使用逗号分隔
					extraCss: binding.value.extraCss, // 额外的css连接，多个逗号分开
					popTitle: binding.value.popTitle, // title的标题
					mode: binding.value.mode ? 1 : 0,//横竖打印
					callback() {
						if (typeof binding.value.callback === 'function') {
							binding.value.callback()
						}
					},
					endCallback() { // 调用打印之后的回调事件
						closeBtn = true;
						if (typeof binding.value.endCallback === 'function') {
							binding.value.endCallback()
						}
					}
				});
			}
		};
	}
};