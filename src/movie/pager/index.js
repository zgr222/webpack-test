import $ from 'jquery';
import styles from './index.module.less';
import { getMovies } from '@/api/movie';
import { createMovieTags } from '@/movie/list'

let container;

/**
 * 初始化函数，负责创建容器
 */
function init() {
    container = $('<div>').addClass(styles.pager).appendTo('#app');
}

init();

/**
 * 根据传入的页码、页容量、总记录数，创建分页区域的标签
 * @params page 页码
 * @params limit 页容量
 * @params total 总页数
 */
export function createPagers(page, limit, total) {
    container.empty();

    /**
     * 
     * @param {*} text 标签的文本
     * @param {*} status 标签的状态，空字符串-普通状态，disabled-禁用状态
     * avtive-选中状态
     * @param {*} targetPage 点击跳转的目标页
     */
    function createTag(text, status, targetPage) {
        const span = $('<span>').appendTo(container).text(text);
        const className = styles[status];
        span.addClass(className);
        if (status === '') {
            span.on('click', async function () {
                // 1、重新获取数据
                const resp = await getMovies(targetPage, limit);
                // 2、重新创建列表
                createMovieTags(resp.data.movieList);
                // 3、重新创建分页
                createPagers(targetPage, limit, resp.data.movieTotal);
            })
        }
    }

    const pageNumber = Math.ceil(total / limit);  //最大页码数
    // 1、创建首页标签
    createTag('首页', page === 1 ? 'disabled' : '', 1);
    // 2、创建上一页标签
    createTag('上一页', page === 1 ? 'disabled' : '', page - 1);
    // 3、创建数字页码的标签
    const maxCount = 10;  //最多能显示多少页
    let min = Math.floor(page - maxCount / 2);
    min < 1 && (min = 1);
    let max = min + maxCount - 1;
    max > pageNumber && (max = pageNumber);
    for (let i = min; i <= max; i++) {
        createTag(i, i === page ? 'active' : '', i);
    }
    // 4、创建下一页标签
    createTag('下一页', page === pageNumber ? 'disabled' : '', page + 1);
    // 5、创建尾页标签
    createTag('尾页', page === pageNumber ? 'disabled' : '', pageNumber);
}