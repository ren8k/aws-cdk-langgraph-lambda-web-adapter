import json
from typing import Annotated, Any, Generator

from langchain_aws import ChatBedrock
from langchain_core.prompts import ChatPromptTemplate
from langgraph.graph import START, StateGraph
from langgraph.graph.state import CompiledStateGraph
from langgraph.types import Command
from typing_extensions import TypedDict

llm = ChatBedrock(
    # model="us.anthropic.claude-3-5-sonnet-20241022-v2:0",
    model="us.anthropic.claude-3-5-haiku-20241022-v1:0",
    region="us-west-2",
)


# Define graph state
class State(TypedDict):
    product_detail: Annotated[str, "製品詳細"]
    copy: Annotated[str, "コピー"]
    target_audience: Annotated[str, "ターゲット顧客"]


# Define the nodes
def generate_copy(state: State) -> Command:
    print("Called generate_copy")
    human_prompt = """
    以下の製品情報から，商品の広告文を作成しなさい．最終的な広告文を1つのみ出力すること．
    <product_details>
    {product_detail}
    </product_details>
    """
    prompt = ChatPromptTemplate([("human", human_prompt)])
    chain = prompt | llm
    response = chain.invoke({"product_detail": state["product_detail"]})

    return Command(
        update={"copy": response.content},
        goto="analysis_target_audience",
    )


def analysis_target_audience(state: State) -> Command:
    print("Called analysis_target_audience")
    human_prompt = """
    以下の広告文に基づいて，最適なターゲット層を分析してください．最終的なターゲット層のみ出力すること．
    <copy>
    {copy}
    </copy>
    """
    prompt = ChatPromptTemplate([("human", human_prompt)])
    chain = prompt | llm
    response = chain.invoke({"copy": state["copy"]})

    return Command(
        update={"target_audience": response.content},
    )


def build_graph() -> CompiledStateGraph:
    builder = StateGraph(State)
    builder.add_edge(START, "generate_copy")
    builder.add_node("generate_copy", generate_copy)
    builder.add_node("analysis_target_audience", analysis_target_audience)
    return builder.compile()


def stream_graph(input: str) -> Generator[str, Any, None]:
    print("Starting graph")
    graph = build_graph()
    stream = graph.stream(input={"product_detail": input}, stream_mode="values")
    for state in stream:
        yield json.dumps(state, ensure_ascii=False) + "\n"
        # print(state)


if __name__ == "__main__":
    product_detail = """
    ラベンダーとベルガモットのやさしい香りが特徴の保湿クリームで、ヒアルロン酸とシアバターの配合により、乾燥肌に潤いを与えます。価格は50g入りで3,800円（税込）です。"""
    stream_graph(product_detail)
