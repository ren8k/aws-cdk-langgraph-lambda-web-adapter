import json

import requests
import streamlit as st

# APIのエンドポイントURL
LAMBDA_URL = "https://XXXXXXXXXXXXXXXXXXXXXXXXXXXXX.lambda-url.ap-northeast-1.on.aws/"
ENDPOINT = "api/stream_graph"
API_URL = LAMBDA_URL + ENDPOINT

# ページ設定
st.set_page_config(
    page_title="商品広告生成アプリ",
    page_icon="🤖",
    layout="wide",
)

# タイトルと説明
st.title("商品広告生成アプリ")
st.markdown("本アプリは、製品情報から広告文を生成し、最適なターゲット層を分析します。")

# 製品情報入力欄
product_detail = st.text_area(
    "製品情報を入力してください",
    height=150,
    placeholder="例：ラベンダーとベルガモットのやさしい香りが特徴の保湿クリームで、ヒアルロン酸とシアバターの配合により、乾燥肌に潤いを与えます。価格は50g入りで3,800円（税込）です。",
)

# 実行ボタン
if st.button("Agent 実行開始", type="primary", disabled=not product_detail):
    # 結果表示用のプレースホルダー
    copy_placeholder = st.empty()
    target_placeholder = st.empty()

    try:
        # APIリクエストを送信
        with st.spinner("実行中..."):
            response = requests.post(
                API_URL,
                json={"product_detail": product_detail},
                stream=True,
                headers={"Accept": "application/json"},
            )

            if response.status_code == 200:
                # ストリーミングレスポンスを処理
                for line in response.iter_lines():
                    if line:
                        # JSONデータをデコード
                        state = json.loads(line.decode("utf-8"))

                        # コピーが生成された場合
                        if "copy" in state:
                            with copy_placeholder.container():
                                st.subheader("📝 生成された広告文")
                                st.info(state["copy"])

                        # ターゲット層が分析された場合
                        if "target_audience" in state:
                            with target_placeholder.container():
                                st.subheader("🎯 ターゲット層分析")
                                st.success(state["target_audience"])
            else:
                st.error(f"APIエラー: ステータスコード {response.status_code}")

    except requests.exceptions.RequestException as e:
        st.error(f"接続エラー: {str(e)}")
    except json.JSONDecodeError as e:
        st.error(f"JSONデコードエラー: {str(e)}")
    except Exception as e:
        st.error(f"予期せぬエラーが発生しました: {str(e)}")

# フッター
st.markdown("---")
st.markdown("Powered by LangGraph & Claude on Bedrock")
